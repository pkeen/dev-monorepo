import { CsrfTokenProvider } from "./CsrfTokenContext";
import { AccessTokenProvider } from "./AccessTokenContext";

export default function AuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<CsrfTokenProvider>
			<AccessTokenProvider>{children}</AccessTokenProvider>
		</CsrfTokenProvider>
	);
}
