import {
	CreateVideoDTO,
	EditVideoDTO,
	CourseDTO,
	CourseTreeDTO,
	EditCourseTreeDTO,
	CourseNodeDTO,
	CreateCourseNodeDTO,
	CreateCourseDTO,
	ContentType,
	ContentItem,
	LessonDetail,
	VideoDTO,
} from "validators";

export {
	CourseNodeDTO,
	CreateCourseNodeDTO,
	CourseDTO,
	CreateCourseDTO,
	ContentType,
	ContentItem,
	LessonDetail,
	VideoDTO,
	CourseTreeDTO,
};

/*
 * CRUD SHAPE FOR COURSE
 * maybe get should be the tree
 * update should be the update tree
 * list should be the basic courseDTO
 */

interface CRUDOperations<G, C, E, L> {
	get: (id: number) => Promise<G | null>;
	create: (input: C) => Promise<G>;
	update: (data: E) => Promise<G>;
	destroy: (id: number) => Promise<void>;
	list: () => Promise<L[]>;
}

export interface CourseCRUD
	extends CRUDOperations<
		CourseTreeDTO,
		CreateCourseDTO,
		EditCourseTreeDTO,
		CourseDTO
	> {}

// interface CRUDOperations<T, C, E> {
// 	list: () => Promise<T[]>;
// 	get: (id: number) => Promise<T | null>;
// 	create: (input: C) => Promise<T>;
// 	update: (data: E) => Promise<T>;
// 	destroy: (id: number) => Promise<void>;
// }

// interface CRUDOerationsComplex<T, C, E, O> extends CRUDOperations<T, C, E> {
// 	display: (id: number) => Promise<O | null>;
// 	// update: (data: E) => Promise<O>;
// 	// updateWithSlots: (data: Partial<S>) => Promise<S | null>;
// }

// export interface CourseCRUD
// 	extends CRUDOerationsComplex<
// 		CourseDTO,
// 		NewCourseDTO,
// 		EditCourseDTO,
// 		CourseDisplay
// 	> {
// 	tree: (id: number) => Promise<CourseTreeDTO | null>;
// 	updateTree: (data: EditCourseTreeDTO) => Promise<CourseTreeDTO | null>;
// 	// deepOutline: (id: number) => Promise<CourseDeepDisplay | null>;
// 	// deep: (id: number) => Promise<CourseDeepDisplay | null>;
// 	// display: (id: number) => Promise<CourseDisplay | null>;
// }

// export interface ModuleCRUD
// 	extends CRUDOerationsComplex<
// 		Module,
// 		CreateModuleDTO,
// 		EditModuleDTO,
// 		ModuleOutline
// 	> {
// 	findUsage: (id: number) => Promise<ModuleUsage>;
// 	tree: (id: number) => Promise<ModuleTreeDTO | null>;
// }

// export interface LessonCRUD
// 	extends CRUDOperations<LessonDetail, CreateLessonDTO, EditLessonDTO, LessonDetail> {
// 	findUsage: (id: number) => Promise<LessonUsage>;
// }

export interface VideoCRUD
	extends CRUDOperations<VideoDTO, CreateVideoDTO, EditVideoDTO, VideoDTO> {
	// findUsage: (id: number) => Promise<VideoUsage>;
}

// export interface LessonUsage {
// 	inCourseSlots: CourseSlot[];
// 	inModuleSlots: ModuleSlot[];
// 	totalCount: number;
// }

// export interface ModuleUsage {
// 	inCourseSlots: CourseSlot[];
// 	totalCount: number;
// }

// export interface VideoUsage {
// 	inLessons: Lesson[];
// 	totalCount: number;
// }

// export {
// 	Lesson,
// 	UiModule,
// 	UiModuleSlot,
// 	Video,
// 	CreateVideoDTO,
// 	EditVideoDTO,
// } from "validators";
