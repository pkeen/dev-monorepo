import { CourseCRUD } from "types";
import { DrizzleDatabase, createSchema } from "./schema";
import {
	CourseDTO,
	courseDTO,
	CourseNodeDTO,
	CourseTreeDTO,
	courseTreeDTO,
	CourseTreeItem,
} from "validators";
import { eq } from "drizzle-orm";

const defaultSchema = createSchema();
type DefaultSchema = typeof defaultSchema;

const toDBId = (id: string): number => parseInt(id, 10);

const createCRUD = (
	db: DrizzleDatabase,
	schema: DefaultSchema = defaultSchema
): {
	course: CourseCRUD;
} => {
	const createCourseRepo = (db: DrizzleDatabase, schema: DefaultSchema) => {
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
						name: contentItem.title,
						order: courseNode.order,
						contentId: courseNode.contentId,
						isPublished: contentItem.isPublished,
						clientId: "", // populate this if needed
						collapsed: false, // or from DB if stored
						children: [], // will be filled in next step
						parentId: courseNode.parentId ?? undefined,
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

		// const create = async (input: CreateCourseDTO) => {
		// 	const [createdCourse] = await db
		// 		.insert(schema.course)
		// 		.values({
		// 			userId: input.userId,
		// 			title: input.title,
		// 			excerpt: input.excerpt,
		// 			isPublished: input.isPublished ?? false,
		// 		})
		// 		.returning();
		// 	return createdCourse;
		// };

		// const update = async (data: EditCourseDTO) => {
		// 	const [course] = await db
		// 		.update(schema.course)
		// 		.set(data)
		// 		.where(eq(schema.course.id, data.id))
		// 		.returning();
		// 	return course;
		// };

		// const destroy = async (id: number) => {
		// 	await db.delete(schema.course).where(eq(schema.course.id, id));
		// };

		return {
			list,
			get,
		};
	};

	return {
		course: createCourseRepo(db, schema),
	};
};
