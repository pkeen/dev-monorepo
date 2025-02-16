import { createTheme } from "@mantine/core";

export const theme = createTheme({
	// fontFamily: "Open Sans, sans-serif",
	primaryColor: "violet",
	autoContrast: true,
	defaultGradient: {
		from: "indigo",
		to: "violet",
		deg: 90,
	},
	defaultRadius: "lg",
});
