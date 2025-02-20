import { Stack } from "@mantine/core";
import { Link } from "react-router";

export const Nav = () => {
	return (
		<Stack>
            <Link to="/admin/dashboard">Dashboard</Link>
			<Link to="/admin/dashboard/courses">Courses</Link>
		</Stack>
	);
};
