"use client";
import { useAccessToken } from "@context/AccessTokenContext";
// import { useAccessToken } from "@context/AuthProvider

import React from "react";

const AccessTokenText = () => {
	const { accessToken } = useAccessToken();

	return (
		<div>AccessToken: {accessToken ? accessToken : "No access token"}</div>
	);
};

export default AccessTokenText;
