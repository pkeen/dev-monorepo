import React from "react";
import { SignOutButton } from "@/lib/auth/components";
import {
	CsrfRequiredButton,
	CsrfText,
	AccessTokenText,
} from "@/lib/auth/components/testing";

const page = () => {
	return (
		<div>
			<h1>Dashboard</h1>
			<p>Not available to non-signed in users</p>
			<SignOutButton />
			<CsrfText />
			<CsrfRequiredButton />
			<AccessTokenText />
		</div>
	);
};

export default page;
