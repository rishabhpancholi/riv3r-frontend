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
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-sm font-medium text-blue-950"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-blue-400 transition hover:text-red-500"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Plus className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
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
          className="h-12 w-full rounded-lg border border-blue-200 bg-white pl-10 pr-4 text-sm text-blue-950 outline-none transition placeholder:text-blue-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
        />
      </div>
    </div>
  );
}