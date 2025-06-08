"use client";
import React, { useState, useCallback } from "react";
import {
	DndContext,
	closestCenter,
	DragEndEvent,
	UniqueIdentifier,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
	defaultAnimateLayoutChanges,
	arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { nanoid } from "nanoid";
import clsx from "clsx";

interface Block {
	id: UniqueIdentifier;
	label: string;
	children: Block[];
}

const createBlock = (label = "Untitled block"): Block => ({
	id: nanoid(),
	label,
	children: [],
});

function findBlock(
	tree: Block[],
	id: UniqueIdentifier
): { parent: Block[]; index: number } | null {
	for (let i = 0; i < tree.length; i++) {
		if (tree[i].id === id) return { parent: tree, index: i };
		const childSearch = findBlock(tree[i].children, id);
		if (childSearch) return childSearch;
	}
	return null;
}

