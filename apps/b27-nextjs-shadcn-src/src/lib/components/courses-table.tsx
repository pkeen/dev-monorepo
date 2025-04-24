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
import { Course } from "@pete_keen/courses/types";

export function CoursesTable({ courses }: { courses: Course[] }) {
	const [search, setSearch] = useState("");
	const filteredCourses = courses.filter((course) =>
		`${course.title} ${course.description}`
			.toLowerCase()
			.includes(search.toLowerCase())
	);
	return (
		<div className="space-y-4">
			<Input
				placeholder="Search courses..."
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
					{filteredCourses.map((course) => (
						<TableRow key={course.id}>
							<TableCell>{course.title}</TableCell>
							<TableCell>
								{course.description?.substring(0, 50) + "..."}
							</TableCell>
							<TableCell>
								{course.isPublished ? "Yes ✅" : "No ❌"}
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
												href={`/admin/courses/${course.id}/edit`}
												className="cursor-pointer"
											>
												Edit
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem className="text-red-600">
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
