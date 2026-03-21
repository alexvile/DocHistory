import { useState, useRef, useEffect } from "react";
import styles from "./ComboBox.module.css";

type Option = {
  id: string | number;
  title: string;
};

type ComboBoxProps = {
  name: string;
  options: Option[];
  placeholder?: string;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
};

export default function ComboBox({
  name,
  options,
  placeholder = "Select...",
  searchParams,
  setSearchParams,
}: ComboBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const ref = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // 🔥 source of truth = URL
  const selectedId = searchParams.get(name);
  const selected =
    options.find((o) => String(o.id) === selectedId) || null;

  const filtered = options.filter((o) =>
    o.title.toLowerCase().includes(query.toLowerCase())
  );

  // ✅ click outside (stable)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  // ✅ sync activeIndex з selected
  useEffect(() => {
    if (open && selected) {
      const index = filtered.findIndex(
        (o) => String(o.id) === String(selected.id)
      );
      setActiveIndex(index);
    }
  }, [open, selected, filtered]);

  // ✅ scroll до активного
  useEffect(() => {
    if (activeIndex >= 0) {
      itemsRef.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  function updateParams(newParams: URLSearchParams) {
    newParams.delete("page"); // reset pagination
    setSearchParams(newParams);
  }

  function handleSelect(option: Option) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(name, String(option.id));
    updateParams(newParams);

    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleClear() {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(name);
    updateParams(newParams);

    setQuery("");
    setActiveIndex(-1);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setActiveIndex(0);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
        break;

      case "Enter":
        if (activeIndex >= 0 && filtered[activeIndex]) {
          e.preventDefault();
          handleSelect(filtered[activeIndex]);
        }
        break;

      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const listId = `${name}-list`;

  return (
    <div className={styles.root} ref={ref}>
      <label>
        <span className="visually-hidden">aaa</span>
      <input
      name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={placeholder}
        value={query || selected?.title || ""}
        onFocus={() => setOpen(true)}
        onClick={() => {
          setOpen(true);
          setQuery(""); // показати весь список
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className="p-input"
      />
</label>
      {selected && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clear}
        >
          ✕
        </button>
      )}

      {open && (
        <ul id={listId} role="listbox" className={styles.list}>
          {filtered.length === 0 && (
            <li className={styles.empty}>No results</li>
          )}

          {filtered.map((option, index) => (
            <li
              key={option.id}
              ref={(el) => (itemsRef.current[index] = el)}
              role="option"
              aria-selected={selected?.id === option.id}
              className={`${styles.item} ${
                index === activeIndex ? styles.itemActive : ""
              } ${
                selected?.id === option.id ? styles.itemSelected : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault(); // 🔥 фікс blur
                handleSelect(option);
              }}
            >
              {option.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}