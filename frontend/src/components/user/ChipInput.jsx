import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const ChipInput = ({ label, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  // Parse current value into array of chips
  const chips = value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const addChip = (text) => {
    if (!text) return;
    const newChips = [...chips, text.trim()];
    onChange(newChips.join(", "));
    setInputValue("");
  };

  const removeChip = (index) => {
    const newChips = chips.filter((_, i) => i !== index);
    onChange(newChips.join(", "));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      removeChip(chips.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addChip(inputValue.trim());
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
      </label>

      {/* Chips Display Area - Outside and Above Input */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {chips.map((chip, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-accent/20"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(i)}
                className="ml-1 hover:text-error focus:outline-none transition-colors rounded-full hover:bg-red-100 p-0.5"
                aria-label={`Remove ${chip}`}
              >
                <IoClose className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Clean Input Field */}
      <div className="w-full rounded-xl text-text-primary border border-border bg-bg px-4 py-3 focus-within:ring-2 focus-within:ring-accent transition-all">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={chips.length === 0 ? placeholder : "Type and press Enter to add more..."}
          className="w-full bg-transparent text-text-primary outline-none placeholder-text-muted"
        />
      </div>

      {/* Helper Text */}
      <p className="text-xs text-text-muted">
        Press <kbd className="px-1.5 py-0.5 bg-surface rounded">Enter</kbd> or{" "}
        <kbd className="px-1.5 py-0.5 bg-surface rounded">,</kbd> to add • Backspace to remove last
      </p>
    </div>
  );
};

export default ChipInput;