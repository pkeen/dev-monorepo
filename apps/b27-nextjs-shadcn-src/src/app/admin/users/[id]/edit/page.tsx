import { Input } from "@/components/ui/input";
import { EditUserForm } from "@/lib/components/edit-user-form";
import { getEnrichedUsers } from "@/lib/db/getEnrichedUsers";

export default async function UserEditPage() {
    const user = await getEnrichedUsers();
	return <div>{user && <EditUserForm user={user[0]} />}</div>;
}
