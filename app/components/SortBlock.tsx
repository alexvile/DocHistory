import { useSearchParams } from "@remix-run/react";

export const SortBlock = () => {
  let [searchParams] = useSearchParams();

  // const [sortOption, setSortOption] = useState(() => searchParams.get("sort"));
  // const [direction, setDirection] = useState(() => searchParams.get("dir"));

  // uncontrolled logic
  const getSortOption = () => {
    return searchParams.get("sort");
  };
  const getDirection = () => {
    return searchParams.get("dir");
  };

  return <div>Sort by</div>;
};
