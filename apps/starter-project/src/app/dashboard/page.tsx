import React from "react";
import { SignOutButton } from "@/lib/auth/components";
import {
	CsrfRequiredButton,
	CsrfText,
	AccessTokenText,
} from "@/lib/auth/components/testing";
// import { auth } from "@/auth";

const page = () => {
	return (
		<div>
			<h1>Dashboard</h1>
			<p>Not available to non-signed in users</p>
			<SignOutButton />
			<CsrfText />
			<CsrfRequiredButton />
			<AccessTokenText />
			{/* <p>{auth.databaseUrl}</p> */}
		</div>
	);
};

export default page;
