import { ModulesTable } from "@/lib/components/course-builder/modules/module-table";
import { courses } from "@/courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ModulesPage() {
	const modules = await courses.module.list();
	return (
		<div className="space-y-4">
			<Button variant="default" size="sm" asChild>
				<Link
					href="/admin/courses/modules/new"
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Module
				</Link>
			</Button>
			<ModulesTable modules={modules} />
		</div>
	);
}

