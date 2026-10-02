"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

export default function SkillsInput({
  value,
  onChange,
  placeholder = "Type a skill and press Enter",
}: SkillsInputProps) {
  const [input, setInput] = useState("");

  function addSkill() {
    const skill = input.trim();
    if (!skill) return;
    if (!value.includes(skill)) {
      onChange([...value, skill]);
    }
    setInput("");
  }

  function removeSkill(skill: string) {
    onChange(value.filter((item) => item !== skill));
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary-dark"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded text-primary/60 transition hover:text-danger"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Plus className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addSkill();
            } else if (event.key === "Backspace" && input === "" && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={addSkill}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>
    </div>
  );
}
