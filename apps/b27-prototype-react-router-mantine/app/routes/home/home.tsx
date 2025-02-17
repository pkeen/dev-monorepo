import {
	Container,
	Group,
	Stack,
	Title,
	Text,
	Card,
	List,
	Button,
	Image,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";

export function Jumbo() {
	return (
		<Container
			size="md"
			// flex={1}
			// h="100%"
			style={{ border: "1px solid red", flex: 1 }}
		>
			<section>
				{/* Hero Section */}

				{/* <Card> */}
				<Group justify="space-between" display="flex">
					<Stack>
						{/* <Title order={1}>Home</Title> */}
						<GradientTitle />
						<List size="md">
							<List.Item>
								Improve quality in your setting
							</List.Item>
							<List.Item>
								Use SSTEW scale for self-assesment, audit or
								research
							</List.Item>
							<List.Item>
								Ensure consistency and reliablity
							</List.Item>
							<List.Item>
								Instructed by the authors of the SSTEW scale
							</List.Item>
						</List>
					</Stack>
					<Stack>
						<Image
							src="/cartoon-nursery.webp"
							style={{
								objectFit: "contain",
								maxWidth: "400px",
								maxHeight: "100%",
							}}
						/>
					</Stack>
				</Group>
				{/* </Card> */}
			</section>
		</Container>
	);
}

export function GradientTitle() {
	const theme = useMantineTheme();
	return (
		<Text
			variant="gradient"
			// gradient={{ from: theme.colors.indigo[5], to: , deg: 45 }}
			size="xl"
			component="h1"
			fw={700}
			// weight={700}
		>
			Online SSTEW Scale training created by the authors
		</Text>
	);
}
