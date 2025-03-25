// --------------------------
// index.ts
// --------------------------
import { AuthZ } from "./authz";
import { createRBAC } from "./rbac";

const rbacModule = createRBAC();

const config = {
	modules: [rbacModule], // a literal array => type is [typeof rbacModule]
};

// Build authZ
const authz = AuthZ(config);

// Now check IntelliSense:

// 1) modules
authz.modules.rbac; // typed as the exact rbac module

// 2) policies
authz.modules.rbac.policies.min; // TS sees the "min" policy
authz.modules.rbac.policies.exact; // TS sees "exact"

// 3) userLifecycle
authz.userLifecycle.enrichUser({ id: "123" }); // typed

// 4) policies
authz.policies.rbac.min({ id: "123" }, { level: 1 }); // typed




