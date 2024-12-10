import { TransportAdapter } from "../types";
import { AuthState, CookieOptions } from "../../core/types";

// export class CookieTransporter implements TransportAdapter {
//     private options: CookieOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         path: "/",
//         maxAge: 3600,
//         sameSite: "lax",
//     };
//     constructor(options?: CookieOptions) {
//         if (options) {
//             this.options = options;
//         }
//     }   

//     storeAuthState(response: any, authState: AuthState): void {
//         // const { accessToken, refreshToken, sessionId } = authState;
//         Object.entries(authState).forEach(([key, value]) => {
//             response.cookies.set(key, value, this.options);
//         });
//     }
// }
