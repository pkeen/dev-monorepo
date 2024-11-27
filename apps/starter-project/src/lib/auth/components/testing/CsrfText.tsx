"use client";
import { useCsrfToken } from "@/lib/auth/context/AuthContext/CsrfTokenContext";

type Props = {};

const CsrfText = (props: Props) => {
	const { csrfToken } = useCsrfToken();
	return <div>Csrf: {csrfToken}</div>;
};

export default CsrfText;
