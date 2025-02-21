import { Stack } from "@mantine/core";
import { Link } from "react-router";

export const Nav = () => {
	return (
		<Stack>
			<Link to="/admin">Dashboard</Link>
			<Link to="/admin/courses">Courses</Link>
		</Stack>
	);
};
