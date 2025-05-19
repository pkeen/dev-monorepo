import {
	Lesson,
	Module,
	ModuleOutline,
	Course,
	CourseOutline,
	CourseSlot,
	ModuleSlot,
	CreateCourseDTO,
	EditCourseDTO,
	CreateModuleDTO,
	EditModuleDTO,
	EditLessonDTO,
	CreateLessonDTO,
	Video,
	CreateVideoDTO,
	EditVideoDTO,
	CourseDeepOutline,
	CourseDeepDTO,
} from "validators";

// // Base interfaces for database models
// export interface Course {
// 	id: number;
// 	userId: string; // UUID
// 	title: string;
// 	description: string | null;
// 	isPublished: boolean;
// }

// // Module Interfaces
// export interface Module {
// 	id: number;
// 	name: string;
// 	description: string | null;
// 	isPublished: boolean;
// }

// export interface ModuleSlot {
// 	id: number;
// 	moduleId: number;
// 	lessonId: number;
// 	order: number;
// }

// export interface ModuleWithSlots extends Module {
// 	slots: ModuleSlot[];
// }

// export interface ModuleSlotOutline extends ModuleSlot {
// 	lesson: Omit<Lesson, "description" | "isPublished">;
// }

// // export interface ModuleOutline extends Module {
// // 	slots: ModuleSlotOutline[];
// // }

// // export interface Lesson {
// // 	id: number;
// // 	name: string;
// // 	description: string | null;
// // 	isPublished: boolean;
// // }

// export interface CourseSlot {
// 	id: number;
// 	courseId: number;
// 	moduleId: number | null;
// 	lessonId: number | null;
// 	order: number;
// }

// interface CourseSlotInput {
// 	courseId: number;
// 	// order: number;
// 	moduleId?: number;
// 	lessonId?: number;
// }

// // Input types for creating new records
// export interface CourseInput {
// 	userId: string;
// 	title: string;
// 	description?: string;
// 	isPublished?: boolean;
// 	courseSlots: CourseSlotInput[];
// }

// export interface CreateModuleInput {
// 	name: string;
// 	description?: string;
// 	isPublished?: boolean;
// }

// export interface CreateLessonInput {
// 	name: string;
// 	description?: string;
// 	isPublished?: boolean;
// }

// export interface CreateCourseSlotInput {
// 	courseId: number;
// 	moduleId?: number;
// 	lessonId?: number;
// }

// export interface CreateModuleSlotInput {
// 	moduleId: number;
// 	lessonId: number;
// }

// // Update types for modifying existing records
// export interface UpdateCourseInput
// 	extends Partial<Omit<Course, "id" | "userId">> {}
// export interface UpdateModuleInput extends Partial<Omit<Module, "id">> {}
// export interface UpdateLessonInput extends Partial<Omit<Lesson, "id">> {}

// // Extended interfaces with relationships
// export interface CourseWithSlots extends Course {
// 	slots: CourseSlotWithContent[];
// }

// export interface CourseSlotWithContent extends CourseSlot {
// 	module?: Module;
// 	lesson?: Lesson;
// }

// // Type guards
// export const isCourseSlotModule = (
// 	slot: CourseSlot
// ): slot is CourseSlot & { moduleId: number; lessonId: null } => {
// 	return slot.moduleId !== null && slot.lessonId === null;
// };

// export const isCourseSlotLesson = (
// 	slot: CourseSlot
// ): slot is CourseSlot & { moduleId: null; lessonId: number } => {
// 	return slot.moduleId === null && slot.lessonId !== null;
// };

interface CRUDOperations<T, C, E> {
	list: () => Promise<T[]>;
	get: (id: number) => Promise<T | null>;
	create: (input: C) => Promise<T>;
	update: (data: E) => Promise<T>;
	destroy: (id: number) => Promise<void>;
}

interface CRUDOerationsComplex<T, C, E, O> extends CRUDOperations<T, C, E> {
	outline: (id: number) => Promise<O | null>;
	// update: (data: E) => Promise<O>;
	// updateWithSlots: (data: Partial<S>) => Promise<S | null>;
}

export interface CourseCRUD
	extends CRUDOerationsComplex<
		Course,
		CreateCourseDTO,
		EditCourseDTO,
		CourseDeepOutline
	> {
	deepOutline: (id: number) => Promise<CourseDeepOutline | null>;
	deep: (id: number) => Promise<CourseDeepDTO | null>;
}

export interface ModuleCRUD
	extends CRUDOerationsComplex<
		Module,
		CreateModuleDTO,
		EditModuleDTO,
		ModuleOutline
	> {
	findUsage: (id: number) => Promise<ModuleUsage>;
}

export interface LessonCRUD
	extends CRUDOperations<Lesson, CreateLessonDTO, EditLessonDTO> {
	findUsage: (id: number) => Promise<LessonUsage>;
}

export interface VideoCRUD
	extends CRUDOperations<Video, CreateVideoDTO, EditVideoDTO> {
	findUsage: (id: number) => Promise<VideoUsage>;
}

export interface LessonUsage {
	inCourseSlots: CourseSlot[];
	inModuleSlots: ModuleSlot[];
	totalCount: number;
}

export interface ModuleUsage {
	inCourseSlots: CourseSlot[];
	totalCount: number;
}

export interface VideoUsage {
	inLessons: Lesson[];
	totalCount: number;
}

export {
	Lesson,
	Module,
	ModuleSlot,
	Course,
	UiCourse,
	UiModule,
	UiCourseSlot,
	UiModuleSlot,
	CourseSlot,
	CourseSlotOutline,
	EditCourseDTO,
	Video,
	CreateVideoDTO,
	EditVideoDTO,
} from "validators";
