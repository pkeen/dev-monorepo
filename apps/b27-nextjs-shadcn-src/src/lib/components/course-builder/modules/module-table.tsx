"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // import the Input component
import { MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { Module, ModuleUsage } from "@pete_keen/courses/types";
import { deleteModule } from "@/lib/actions/module/deleteModule";
import { toast } from "sonner";
import { ConfirmDeleteModuleDialog } from "./confirm-delete-module";
import { getModuleUsage } from "@/lib/actions/module/getModuleUsage";

export function ModulesTable({ modules }: { modules: Module[] }) {
	const [allModules, setAllModules] = useState(modules);
	const [search, setSearch] = useState("");
	const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
	const [moduleUsage, setModuleUsage] = useState<ModuleUsage | null>(null);

	console.log("moduleUsage", moduleUsage);

	const filteredModules = allModules.filter((module) =>
		`${module.name} ${module.description}`
			.toLowerCase()
			.includes(search.toLowerCase())
	);

	const handleDelete = async (moduleId: number) => {
		if (!moduleToDelete) return;
		try {
			await deleteModule(moduleId);
			setAllModules((prev) => prev.filter((m) => m.id !== moduleId));
			setModuleToDelete(null);
			toast.success("Module deleted!");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong deleting the module.");
		}
	};
	return (
		<div className="space-y-4">
			<ConfirmDeleteModuleDialog
				onConfirm={() => handleDelete(moduleToDelete?.id)}
				open={!!moduleToDelete}
				setOpen={(open) => {
					if (!open) setModuleToDelete(null);
				}}
				actionVerb="Delete"
				moduleUsage={moduleUsage}
			/>
			<Input
				placeholder="Search modules..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-left">Title</TableHead>
						<TableHead className="text-left">Description</TableHead>
						<TableHead className="text-left">Published</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredModules.map((module) => (
						<TableRow key={module.id}>
							<TableCell>{module.name}</TableCell>
							<TableCell>
								{module.description?.substring(0, 50) + "..."}
							</TableCell>
							<TableCell>
								{module.isPublished ? "Yes ✅" : "No ❌"}
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem asChild>
											<Link
												href={`/admin/courses/modules/${module.id}/edit`}
												className="cursor-pointer"
											>
												Edit
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-600 cursor-pointer"
											onClick={async () => {
												setModuleUsage(null);
												setModuleToDelete(module);
												const usage =
													await getModuleUsage(
														module.id
													);
												setModuleUsage(usage);
											}}
										>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
