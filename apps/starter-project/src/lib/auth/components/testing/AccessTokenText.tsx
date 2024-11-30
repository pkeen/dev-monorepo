"use client";
// import { useAccessToken } from "@/lib/auth/context/AuthContext/AccessTokenContext";
import { useAccessToken } from "../../context/AuthContext/AuthProvider";

import React from "react";

const AccessTokenText = () => {
	const { accessToken } = useAccessToken();

	return (
		<div>AccessToken: {accessToken ? accessToken : "No access token"}</div>
	);
};

export default AccessTokenText;
