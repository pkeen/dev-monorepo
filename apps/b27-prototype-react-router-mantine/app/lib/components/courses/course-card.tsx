import { Link } from "react-router";

export const CourseCard = (course) => {
	return (
		<div>
			<h1>{course.name}</h1>
			<p>{course.description}</p>
			<p>{course.instructor}</p>
			<p>{course.price}</p>
		</div>
	);
};
