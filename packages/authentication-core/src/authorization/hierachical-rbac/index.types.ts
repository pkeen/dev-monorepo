/**
 * Call back for roles and permissions to be stored in session
 * should return the roles and/or permissions to be stored in session
 */
export type SessionCallback = (userId: string) => RolesAndPermissions;

export type RolesAndPermissions = {
	roles?: Role[]; // lets keep it simple as roles for now
	// permissions?: string[];
};

export type Role = {
	name: string;
	level: number;
	// inherits?: string[];
	// permissions?: string[];
};

export type RoleHierarchy = Role[];

export type SelectRole =
	| { name: string; level?: never }
	| { level: number; name?: never };

export type RBACConfig = {
	roles: Role[];
	defaultRole: SelectRole;
};

// Define the type for the extra authz data
export interface AuthzData {
	roles?: string[]; // Could be an array of role names
	permissions?: string[]; // Optional permissions array
}
