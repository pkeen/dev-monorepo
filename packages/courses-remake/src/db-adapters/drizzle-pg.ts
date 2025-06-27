import { ContentItemCRUD, CourseCRUD } from "types";
import {
	DrizzleDatabase,
	createSchema,
	DrizzleDbWithSchema,
	DefaultSchema,
} from "./schema";
import {
	contentItemDTO,
	ContentItemDTO,
	CourseDTO,
	courseDTO,
	CourseTreeDTO,
	courseTreeDTO,
	CourseTreeItem,
	CourseTreeItemUpsert,
	CreateCourseTreeDTO,
	EditCourseTreeDTO,
} from "validators";
import { eq, inArray } from "drizzle-orm";

// const defaultSchema = createSchema();

const toDBId = (id: string): number => parseInt(id, 10);

const createCRUD = (
	db: DrizzleDbWithSchema,
	schema: DefaultSchema
): {
	course: CourseCRUD;
	content: ContentItemCRUD;
} => {
	const createCourseRepo = (db: DrizzleDbWithSchema) => {
		function assignClientIds(
			nodes: CourseTreeItem[],
			parentClientId: string = "",
			depth: number = 0
		): void {
			nodes.forEach((node, index) => {
				node.clientId = `${parentClientId}${depth}-${index}`;
				assignClientIds(node.children, `${node.clientId}-`, depth + 1);
			});
		}

		const flattenCourseNodes = (
			nodes: CourseTreeItemUpsert[],
			parentId: number | null,
			flat: {
				id?: number;
				order: number;
				contentId: number;
				parentId: number | null;
			}[] = []
		): typeof flat => {
			for (const node of nodes) {
				flat.push({
					id: node.id,
					order: node.order,
					contentId: node.contentId,
					parentId,
				});
				if (node.children) {
					flattenCourseNodes(node.children, node.id ?? null, flat);
				}
			}
			return flat;
		};

		const syncCourseTree = async (
			courseId: number,
			incomingItems: CourseTreeItemUpsert[]
		) => {
			const flatIncoming = flattenCourseNodes(incomingItems, null);

			const existing = await db.query.courseNode.findMany({
				where: eq(schema.courseNode.courseId, courseId),
			});
			const existingMap = new Map(existing.map((n) => [n.id, n]));

			const incomingMap = new Map(
				flatIncoming.filter((n) => n.id).map((n) => [n.id!, n])
			);

			const toDelete = existing.filter((n) => !incomingMap.has(n.id));
			const toCreate = flatIncoming.filter((n) => !n.id);
			const toUpdate = flatIncoming.filter((n) => {
				if (!n.id) return false;
				const old = existingMap.get(n.id);
				return (
					old &&
					(old.order !== n.order ||
						old.parentId !== n.parentId ||
						old.contentId !== n.contentId)
				);
			});

			// DELETE
			if (toDelete.length) {
				await db.delete(schema.courseNode).where(
					inArray(
						schema.courseNode.id,
						toDelete.map((n) => n.id)
					)
				);
			}

			// UPDATE
			for (const n of toUpdate) {
				await db
					.update(schema.courseNode)
					.set({
						order: n.order,
						parentId: n.parentId,
						contentId: n.contentId,
					})
					.where(eq(schema.courseNode.id, n.id!));
			}

			// CREATE
			if (toCreate.length) {
				await db.insert(schema.courseNode).values(
					toCreate.map((n) => ({
						courseId,
						parentId: n.parentId,
						order: n.order,
						contentId: n.contentId,
					}))
				);
			}
		};

		const upsertNodeRecursive = async (
			node: CourseTreeItemUpsert,
			parentId: number | null,
			courseId: number
		) => {
			if (node.id) {
				// Update
				await db
					.update(schema.courseNode)
					.set({
						order: node.order,
						parentId,
						contentId: node.contentId,
					})
					.where(eq(schema.courseNode.id, node.id));
			} else {
				// Create
				const inserted = await db
					.insert(schema.courseNode)
					.values({
						courseId,
						parentId,
						order: node.order,
						contentId: node.contentId,
					})
					.returning({ id: schema.courseNode.id });

				node.id = inserted[0].id; // so children can use it as parentId
			}

			if (node.children) {
				for (const child of node.children) {
					await upsertNodeRecursive(child, node.id, courseId);
				}
			}
		};

		const list = async (): Promise<CourseDTO[]> => {
			const results = await db.select().from(schema.course);
			const parsed = courseDTO.array().safeParse(results);
			if (!parsed.success) {
				throw new Error("Invalid course data");
			}
			return parsed.data;
		};

		const get = async (id: number): Promise<CourseTreeDTO | null> => {
			const results = await db
				.select({
					course: schema.course,
					courseNode: schema.courseNode,
					contentItem: schema.contentItem,
				})
				.from(schema.course)
				.leftJoin(
					schema.courseNode,
					eq(schema.course.id, schema.courseNode.courseId)
				)
				.orderBy(schema.courseNode.order)
				.leftJoin(
					schema.contentItem,
					eq(schema.courseNode.contentId, schema.contentItem.id)
				)
				.where(eq(schema.course.id, id));

			if (results.length === 0) return null;

			const { course } = results[0];

			// Step 1: flatten nodes
			const flatItems = results
				.filter((r) => r.courseNode && r.contentItem)
				.map((r): CourseTreeItem => {
					const courseNode = r.courseNode!;
					const contentItem = r.contentItem!;
					return {
						id: courseNode.id,
						type: contentItem.type,
						title: contentItem.title,
						order: courseNode.order,
						contentId: courseNode.contentId,
						isPublished: contentItem.isPublished,
						clientId: "", // populate this if needed
						collapsed: false, // or from DB if stored
						children: [], // will be filled in next step
						parentId: courseNode.parentId ?? null,
					};
				});

			// Step 2: build tree
			const nodeMap = new Map<number, CourseTreeItem>();
			const roots: CourseTreeItem[] = [];

			for (const item of flatItems) {
				nodeMap.set(item.id, item);
			}

			for (const item of flatItems) {
				if (item.parentId && nodeMap.has(item.parentId)) {
					nodeMap.get(item.parentId)!.children.push(item);
				} else {
					roots.push(item);
				}
			}

			assignClientIds(roots);

			// Step 3: return CourseTree
			const courseTree: CourseTreeDTO = {
				...course,
				items: roots,
			};

			// Optional: validate
			courseTreeDTO.parse(courseTree);

			return courseTree;
		};

		const update = async (data: EditCourseTreeDTO) => {
			try {
				// 1. Update course info
				await db
					.update(schema.course)
					.set({
						title: data.title,
						excerpt: data.excerpt,
						isPublished: data.isPublished ?? false,
						updatedAt: new Date(),
					})
					.where(eq(schema.course.id, data.id));

				// 2. Sync course nodes
				await syncCourseTree(data.id, data.items);

				const course = await get(data.id);
				if (!course) {
					throw new Error("Failed to update course");
				}
				return course;
			} catch (error) {
				throw error;
			}
		};

		const destroy = async (courseId: number) => {
			// Step 1: Delete courseNodes
			await db
				.delete(schema.courseNode)
				.where(eq(schema.courseNode.courseId, courseId));

			// Step 2: Delete course
			await db
				.delete(schema.course)
				.where(eq(schema.course.id, courseId));
		};

		const create = async (
			data: CreateCourseTreeDTO
		): Promise<CourseTreeDTO> => {
			try {
				// Step 1: Insert course
				const [created] = await db
					.insert(schema.course)
					.values({
						userId: data.userId,
						title: data.title,
						excerpt: data.excerpt,
						isPublished: data.isPublished ?? false,
						createdAt: new Date(),
						updatedAt: new Date(),
					})
					.returning({ id: schema.course.id });

				const courseId = created.id;

				// Step 2: Sync tree (all inserts)
				await syncCourseTree(courseId, data.items);

				const course = await get(courseId);
				if (!course) {
					throw new Error("Failed to create course");
				}
				return course;
			} catch (error) {
				throw error;
			}
		};

		return {
			list,
			get,
			update,
			destroy,
			create,
		};
	};

	const contentItemRepo = (db: DrizzleDbWithSchema) => {
		const list = async (): Promise<ContentItemDTO[]> => {
			const results = await db.select().from(schema.contentItem);
			const parsed = contentItemDTO.array().safeParse(results);
			if (!parsed.success) {
				throw new Error("Invalid content item data");
			}
			return parsed.data;
		};

		const get = async (id: number): Promise<ContentItemDTO | null> => {
			const results = await db
				.select()
				.from(schema.contentItem)
				.where(eq(schema.contentItem.id, id));
			const parsed = contentItemDTO.array().safeParse(results);
			if (!parsed.success) {
				throw new Error("Invalid content item data");
			}
			return parsed.data[0];
		};

		return {
			list,
			get,
		};
	};

	return {
		course: createCourseRepo(db),
		content: contentItemRepo(db),
	};
};

export const DrizzlePGAdapter = (
	db: DrizzleDbWithSchema,
	schema: DefaultSchema = createSchema()
): DBAdapter => {
	return {
		...createCRUD(db, schema),
	};
};

export interface DBAdapter {
	course: CourseCRUD;
	content: ContentItemCRUD;
	// module: ModuleCRUD;
	// lesson: LessonCRUD;
	// video: VideoCRUD;
}

export const createCoursesDBAdapter = (
	db: DrizzleDbWithSchema,
	schema: DefaultSchema = createSchema()
) => {
	return {
		adapter: DrizzlePGAdapter(db, schema),
		schema,
	};
};
