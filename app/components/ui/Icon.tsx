import { Svg } from "../Svg";
import styles from "./Icon.module.css";

type IconProps = {
  name: string;
  color?: string;
};



export function Icon({ name, color }: IconProps) {
  return (
    <span className={styles.iconWrapper} {...(color ? { style: { "--icon-color": color } as React.CSSProperties } : {})}>
      <Svg name={name} />
    </span>
  );
}
