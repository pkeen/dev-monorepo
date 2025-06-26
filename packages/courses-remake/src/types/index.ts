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
	ContentItemDTO,
	LessonDetail,
	VideoDTO,
	CreateContentItemDTO,
	EditContentItemDTO,
} from "validators";

export {
	CourseNodeDTO,
	CreateCourseNodeDTO,
	CourseDTO,
	CreateCourseDTO,
	ContentType,
	ContentItemDTO,
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

// export interface LessonCRUD
// 	extends CRUDOperations<LessonDetail, CreateLessonDTO, EditLessonDTO, LessonDetail> {
// 	findUsage: (id: number) => Promise<LessonUsage>;
// }

export interface VideoCRUD
	extends CRUDOperations<VideoDTO, CreateVideoDTO, EditVideoDTO, VideoDTO> {
	// findUsage: (id: number) => Promise<VideoUsage>;
}

export interface ContentItemCRUD
	extends CRUDOperations<
		ContentItemDTO,
		CreateContentItemDTO,
		EditContentItemDTO,
		ContentItemDTO
	> {}

export interface ContentUsage {
	courseNodes: CourseNodeDTO[];
}

// export {
// 	Lesson,
// 	UiModule,
// 	UiModuleSlot,
// 	Video,
// 	CreateVideoDTO,
// 	EditVideoDTO,
// } from "validators";
