// components/logo-button.tsx
import { Logo } from "./logo";

export function LogoButton({ color = "#1d4ed8" }: { color?: string }) {
	return (
		<div className="rounded-full p-2 bg-transparent">
			<Logo color={color} className="w-8 h-8" />
		</div>
	);
}

import { GradientLogo } from "./logo";

export function GradientLogoButton({
	gradientFrom,
	gradientTo,
}: {
	gradientFrom?: string;
	gradientTo?: string;
}) {
	return (
		<div className="rounded-full p-2 bg-transparent">
			<GradientLogo
				gradientFrom={gradientFrom}
				gradientTo={gradientTo}
				className="w-8 h-8"
			/>
		</div>
	);
}
