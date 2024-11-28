"use client";
import { useCsrfToken } from "@context/CsrfTokenContext";

type Props = {};

const CsrfText = (props: Props) => {
	const { csrfToken } = useCsrfToken();
	return <div>Csrf: {csrfToken}</div>;
};

export default CsrfText;
