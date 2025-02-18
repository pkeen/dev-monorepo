import { Stack } from "@mantine/core";
import { Link } from "react-router";

export const Nav = () => {
	return (
		<Stack>
            <Link to="/dashboard">Dashboard</Link>
			<Link to="/dashboard/courses">Courses</Link>
		</Stack>
	);
};
