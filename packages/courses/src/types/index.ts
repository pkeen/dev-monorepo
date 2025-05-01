// Base interfaces for database models
export interface Course {
	id: number;
	userId: string; // UUID
	title: string;
	description: string | null;
	isPublished: boolean;
}

export interface Module {
	id: number;
	name: string;
	description: string | null;
	isPublished: boolean;
}

export interface Lesson {
	id: number;
	name: string;
	description: string | null;
	isPublished: boolean;
}

export interface CourseSlot {
	id: number;
	courseId: number;
	moduleId: number | null;
	lessonId: number | null;
	order: number;
}

export interface ModuleSlot {
	id: number;
	moduleId: number;
	lessonId: number;
	order: number;
}

interface CourseSlotInput {
	courseId: number;
	// order: number;
	moduleId?: number;
	lessonId?: number;
}

// Input types for creating new records
export interface CourseInput {
	userId: string;
	title: string;
	description?: string;
	isPublished?: boolean;
	courseSlots: CourseSlotInput[];
}

export interface CreateModuleInput {
	name: string;
	description?: string;
	isPublished?: boolean;
}

export interface CreateLessonInput {
	name: string;
	description?: string;
	isPublished?: boolean;
}

export interface CreateCourseSlotInput {
	courseId: number;
	moduleId?: number;
	lessonId?: number;
}

export interface CreateModuleSlotInput {
	moduleId: number;
	lessonId: number;
}

// Update types for modifying existing records
export interface UpdateCourseInput
	extends Partial<Omit<Course, "id" | "userId">> {}
export interface UpdateModuleInput extends Partial<Omit<Module, "id">> {}
export interface UpdateLessonInput extends Partial<Omit<Lesson, "id">> {}

// Extended interfaces with relationships
export interface CourseWithSlots extends Course {
	slots: CourseSlotWithContent[];
}

export interface ModuleSlotOutline extends ModuleSlot {
	lesson: Omit<Lesson, "description" | "isPublished">;
}

export interface ModuleOutline extends Module {
	lessonSlots: ModuleSlotOutline[];
}

export interface CourseSlotWithContent extends CourseSlot {
	module?: Module;
	lesson?: Lesson;
}

// Type guards
export const isCourseSlotModule = (
	slot: CourseSlot
): slot is CourseSlot & { moduleId: number; lessonId: null } => {
	return slot.moduleId !== null && slot.lessonId === null;
};

export const isCourseSlotLesson = (
	slot: CourseSlot
): slot is CourseSlot & { moduleId: null; lessonId: number } => {
	return slot.moduleId === null && slot.lessonId !== null;
};

interface CRUDOperations<T> {
	list: () => Promise<T[]>;
	get: (id: string) => Promise<T | null>;
	create: (input: Partial<Omit<T, "id">>) => Promise<T>;
	update: (id: string, data: Partial<T>) => Promise<T>;
	delete: (id: string) => Promise<void>;
}

interface CRUDOerationsWithOutline<T, O> extends CRUDOperations<T> {
	outline: (id: string) => Promise<O | null>;
}

export type CourseCRUD = CRUDOperations<Course>;

export type ModuleCRUD = CRUDOerationsWithOutline<Module, ModuleOutline>;

export type LessonCRUD = CRUDOperations<Lesson>;
