"use client";
import { useRouter } from "next/navigation";

type Props = {};

const SignUpButton = (props: Props) => {
	const router = useRouter();
	return <button onClick={() => router.push("/auth/signup")}>Sign Up</button>;
};

export default SignUpButton;
