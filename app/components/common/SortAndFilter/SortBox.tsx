import { SortBoxProps, SortConfig, SortGroup } from "~/types";

function hasGroups(config: SortConfig): config is Extract<SortConfig, { groups: SortGroup[] }> {
  return "groups" in config && Array.isArray(config.groups);
}

export function SortBox({ searchParams, setSearchParams, config }: SortBoxProps) {
  const [defaultSort, defaultDir] = config.default.split(":");
  const sort = searchParams.get("sort") ?? defaultSort;
  const dir = searchParams.get("dir") ?? defaultDir;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [newSort, newDir] = e.target.value.split(":");
    const next = new URLSearchParams(searchParams);
    next.set("sort", newSort);
    next.set("dir", newDir);
    next.delete("page");
    setSearchParams(next);
  }

  return (
    <label>
      <span className="visually-hidden">Сортування</span>
      <select value={`${sort}:${dir}`} onChange={handleChange} className="p-select">
        {hasGroups(config)
          ? config.groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          : config.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
      </select>
    </label>
  );
}
