import { SortBoxProps, SortConfig, SortGroup } from "~/types";

function hasGroups(config: SortConfig): config is Extract<SortConfig, { groups: SortGroup[] }> {
  return "groups" in config && Array.isArray(config.groups);
}

export function SortBox({ searchParams, setSearchParams, config }: SortBoxProps) {
  const sort = searchParams.get("sort") ?? "title";
  const dir = searchParams.get("dir") ?? "asc";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [newSort, newDir] = e.target.value.split(":");
    searchParams.set("sort", newSort);
    searchParams.set("dir", newDir);
    setSearchParams(searchParams);
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
