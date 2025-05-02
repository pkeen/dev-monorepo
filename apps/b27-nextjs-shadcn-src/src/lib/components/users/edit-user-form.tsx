"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnrichedUser } from "@/lib/db/getEnrichedUsers";
import { cn } from "@/lib/utils"; // assuming you use this for className merging
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { updateUserAndRole } from "@/lib/actions/updateUserAndRole";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// 1. Define schema
const formSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email().optional(),
	roleId: z.string().optional().nullable(),
});

// 2. Infer TypeScript type
type FormValues = z.infer<typeof formSchema>;

// TODO get roles data from db or rbac
type Role = { id: string; name: string; key: string; level: number };

// 3. Use in form
export const EditUserForm = ({
	user,
	roles,
}: {
	user: EnrichedUser | null;
	roles: Role[];
}) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: user ?? {
			name: "",
			email: undefined,
			roleId: undefined,
		},
	});

	const { isDirty, isSubmitting } = form.formState;

	const onSubmit = (data: FormValues) => {
		startTransition(async () => {
			try {
				if (!user) return;
				await updateUserAndRole(user.id, data);
				toast.success("User updated!");
				router.refresh(); // reload data if you're on the same page
			} catch (err) {
				toast.error("Something went wrong updating the user.");
				console.error(err);
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="roleId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Role</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"justify-between",
												!field.value &&
													"text-muted-foreground"
											)}
										>
											{roles.find(
												(role) =>
													role.id === field.value
											)?.name || "Select role"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="p-0">
									<Command>
										<CommandInput placeholder="Search roles..." />
										<CommandEmpty>
											No roles found.
										</CommandEmpty>
										<CommandGroup>
											{roles.map((role) => (
												<CommandItem
													key={role.id}
													value={role.id}
													onSelect={() => {
														field.onChange(role.id);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															role.id ===
																field.value
																? "opacity-100"
																: "opacity-0"
														)}
													/>
													{role.name}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>
								This determines the user’s access level.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={!isDirty || isSubmitting}>
					{isSubmitting ? "Saving..." : "Save Changes"}
				</Button>
			</form>
		</Form>
	);
};
