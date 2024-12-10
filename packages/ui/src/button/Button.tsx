"use client";

import React from "react";
import { useState } from "react";

export interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary";
}

export const Button = ({
	children,
	onClick,
	variant = "primary",
}: ButtonProps) => {
	const [primary, setPrimary] = useState("primary");
	// const [count, setCount] = useState(0);

	const handleClick = () => {
		setPrimary((prev) => (prev === "primary" ? "secondary" : "primary"));
	};

	return (
		<button
			onClick={handleClick}
			style={{
				padding: "8px 16px",
				borderRadius: "4px",
				border: "none",
				backgroundColor: variant === "primary" ? "#007bff" : "#6c757d",
				color: "white",
				cursor: "pointer",
			}}
		>
			{children}
		</button>
	);
};
