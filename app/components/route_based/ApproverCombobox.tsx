import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";

export type ApproverVM = {
  id: string;
  firstName: string;
  lastName: string;
};

type FetcherData = {
  approvers: ApproverVM[];
};

type Props = {
  name: string;
  value?: string;
  onChange?: (id: string) => void;
};

export function ApproverSelect({ name, value, onChange }: Props) {
  const fetcher = useFetcher<FetcherData>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(value);
  const [focused, setFocused] = useState(false);

  // fetch один раз
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

  return (
    <div ref={wrapperRef} className="combo" role="combobox" aria-expanded={focused} aria-haspopup="listbox">
      {/* search / display */}
      <input
        type="text"
        className="combo__input"
        placeholder="Select approver"
        value={query || selectedLabel}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          // даємо select встигнути відпрацювати
          requestAnimationFrame(() => setFocused(false));
        }}
        onChange={(e) => setQuery(e.target.value)}
        aria-autocomplete="list"
      />

      {/* select показуємо ТІЛЬКИ при фокусі */}
      {/* {focused} */}

      <select
        className="combo__select"
        size={Math.min(filtered.length + 1, 6)}
        value={selectedId ?? ""}
        onChange={(e) => {
          const id = e.target.value || undefined;
          setSelectedId(id);
          setQuery("");
          onChange?.(id ?? "");
        }}
      >
        <option value="">Select approver</option>

        {filtered.map((u) => (
          <option key={u.id} value={u.id}>
            {u.firstName} {u.lastName}
          </option>
        ))}
      </select>

      {/* hidden — реальне значення для форми */}
      <input type="hidden" name={name} value={selectedId ?? ""} />
    </div>
  );
}
