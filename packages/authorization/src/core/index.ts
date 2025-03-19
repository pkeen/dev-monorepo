export interface Entity {
	name: string;
	pluralName?: string;
	hierachical?: boolean;
}

type HeierachicalEntity = Entity & { hierachical: true; level: number };

export interface AuthZ {
	// Heres the choice, do we take an entities object/array and put all Roles, Permissions, Orgs etc in there
	// or do we have a Roles object, a Permissions object, and a custom entities object?

	entities: Record<string, Entity>;
	// should the schema and table be returned to user to add to their own migrations? probably yes
	schemaName?: string; // ???

}
