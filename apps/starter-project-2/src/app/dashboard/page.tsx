import React from "react";
// import { SignOutButton } from "@/lib/auth/components";
// import { SignOutButton } from "@pete_keen/north/components";
// import {
// 	CsrfRequiredButton,
// 	CsrfText,
// 	AccessTokenText,
// } from "@pete_keen/north/components";
// import { components } from "@pete_keen/north";
// import { auth } from "@/auth";
import { TesterComponent } from "@pete_keen/north";
// import { TesterComponent } from "@pete_keen/fuck-off";

const page = () => {
	return (
		<div>
			<h1>Dashboard</h1>
			<p>Not available to non-signed in users</p>
			<TesterComponent />
			{/* <SignOutButton />
			<CsrfText />
			<CsrfRequiredButton />
			<AccessTokenText /> */}
			{/* <p>{auth.databaseUrl}</p> */}
		</div>
	);
};

export default page;
