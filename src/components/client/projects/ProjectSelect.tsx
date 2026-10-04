"use client";

import { Check, ChevronDown } from "lucide-react";
import { Select } from "radix-ui";
import { cn } from "@/lib/cn";

export interface ProjectSelectOption { value: string; label: string; display?: string }

export default function ProjectSelect({ value, onValueChange, options, placeholder, ariaLabel, id, disabled = false, invalid = false, className }: { value?: string; onValueChange: (value: string) => void; options: ProjectSelectOption[]; placeholder: string; ariaLabel: string; id?: string; disabled?: boolean; invalid?: boolean; className?: string }) {
  const selectedOption = options.find(option => option.value === value);
  return <Select.Root value={value || undefined} onValueChange={onValueChange} disabled={disabled}><Select.Trigger id={id} aria-label={ariaLabel} aria-invalid={invalid} className={cn("group flex h-11 w-full min-w-32 items-center rounded-xl border bg-surface px-3 text-left text-sm outline-none transition data-[placeholder]:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-55", invalid ? "border-danger" : "border-line", className)}><Select.Value placeholder={placeholder} className="min-w-0 truncate">{selectedOption?.display ?? selectedOption?.label}</Select.Value><Select.Icon className="ml-auto pl-2 text-muted"><ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" /></Select.Icon></Select.Trigger><Select.Portal><Select.Content position="popper" sideOffset={6} className="z-[1000] max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-card"><Select.Viewport>{options.map(option => <Select.Item key={option.value} value={option.value} className="relative flex min-h-10 cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-9 text-sm outline-none data-[highlighted]:bg-primary-soft data-[highlighted]:text-primary-dark"><Select.ItemText>{option.label}</Select.ItemText><Select.ItemIndicator className="absolute right-3 text-primary"><Check className="h-4 w-4" /></Select.ItemIndicator></Select.Item>)}</Select.Viewport></Select.Content></Select.Portal></Select.Root>;
}
