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
	ThemeIcon,
	Grid,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";

export function Jumbo() {
	return (
		<section style={{ display: "flex", flex: 1 }}>
			<Container size="md" style={{ flex: 1, display: "flex" }}>
				{/* Hero Section */}

				{/* <Card> */}
				<Grid
					gutter={{ base: 20, xs: "md", md: "xl", xl: 50 }}
					style={{
						flex: 1,
						display: "flex",
					}}
				>
					<Grid.Col
						span={{ base: 12, md: 6 }}
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "2rem",
							justifyContent: "center",
							// flex: 1,
							// border: "1px solid green",
						}}
					>
						{/* <Title order={1}>Home</Title> */}
						<GradientTitle />
						<List
							size="md"
							icon={
								<ThemeIcon color="grey" size={24} radius="xl">
									<IconCircleCheck size={16} />
								</ThemeIcon>
							}
						>
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
						<Group>
							<Button variant="gradient">Start here</Button>
						</Group>
					</Grid.Col>
					<Grid.Col
						span={{ base: 12, md: 6 }}
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "2rem",
							justifyContent: "center",
							// flex: 1,
							// border: "1px solid green",
							alignItems: "center",
						}}
					>
						<Image
							src="/cartoon-nursery.webp"
							style={{
								objectFit: "contain",
								maxWidth: "400px",
								maxHeight: "100%",
							}}
						/>
					</Grid.Col>
				</Grid>
				{/* </Card> */}
			</Container>
		</section>
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
			fw={800}
			// weight={700}
		>
			Online SSTEW Scale training created by the authors
		</Text>
	);
}
