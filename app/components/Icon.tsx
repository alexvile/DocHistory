import { Svg } from "./Svg";

type IconProps = {
  name: string;
  color?: string;
};

export function Icon({ name, color }: IconProps) {
  return (
    <span className={`icon-wrapper`} {...(color ? { style: { "--icon-color": color } as React.CSSProperties } : {})}>
      <Svg name={name} />
    </span>
  );
}
