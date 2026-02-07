import { useFetcher } from "@remix-run/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { UserVM } from "~/types";

type Approver = Pick<UserVM, "id" | "firstName" | "lastName">;

type FetcherData = {
  approvers: Approver[];
};

type Props = {
  value: string | undefined;
  onChange: (id: string) => void;
};

// todo - fix controlled-uncontrolled issue!!!!
export function ApproverCombobox({ value, onChange }: Props) {
  const id = useId();
  const fetcher = useFetcher<FetcherData>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(value);
  const [focused, setFocused] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") {
      fetcher.load("/resources/approvers");
    }
  }, [fetcher]);


  const approvers = fetcher.data?.approvers ?? [];

  const selected = approvers.find((u) => u.id === selectedId);
  const selectedLabel = selected ? `${selected.firstName} ${selected.lastName}` : "";

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return approvers;

    return approvers.filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q));
  }, [approvers, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setFocused(false);
        setShowSelect(false);
        setIsEditing(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="combo" role="combobox" aria-expanded={focused} aria-haspopup="listbox">
      {/* search / display */}

      <div className="combo__input-and-label">
        <input type="hidden" name="approverId" value={selectedId} />
        <label htmlFor={id}>Погоджує:</label>
        <input
          id={id}
          type="text"
          name="approverName"
          className="combo__input"
          placeholder="Оберіть особу"
          value={isEditing ? query : selectedLabel}
          onFocus={() => {
            setFocused(true);
            setShowSelect(true);
            setIsEditing(true);
            setQuery("");
          }}
          onChange={(e) => setQuery(e.target.value)}
          aria-autocomplete="list"
        />
      </div>

      {showSelect && (
        <select
          className="combo__select"
          size={Math.min(filtered.length + 1, 6)}
          value={selectedId ?? ""}
          onChange={(e) => {
            const id = e.target.value || undefined;
            setSelectedId(id);
            setQuery("");
            setIsEditing(false);
            setShowSelect(false);
            onChange?.(id ?? "");
          }}
        >
          <option value="" disabled>
            Оберіть особу
          </option>

          {filtered.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>
      )}
      {/* ❌ Clear button */}
      {selectedId && !isEditing && (
        <button
          type="button"
          className="combo__clear"
          aria-label="Clear selection"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(undefined);
            setSelectedId(undefined);
            setQuery("");
            setIsEditing(false);
            setShowSelect(false);
          }}
        >
          ×
        </button>
      )}
      {/* <input type="hidden" name={name} value={selectedId ?? ""} /> */}
    </div>
  );
}
