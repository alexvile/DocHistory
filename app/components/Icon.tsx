import { Svg } from "./Svg";

type IconProps = {
  name: string;
};

export function Icon({ name }: IconProps) {
  return (
    <span className={`icon-wrapper`}>
      <Svg name={name} />
    </span>
  );
}
