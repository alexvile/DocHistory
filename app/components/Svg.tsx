import { AiOutlineStop } from "react-icons/ai";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { VscIndent } from "react-icons/vsc";
import { GoHeading } from "react-icons/go";
import { FaLayerGroup, FaUsers } from "react-icons/fa";
import { TbExchange } from "react-icons/tb";
import { MdManageAccounts, MdLogout } from "react-icons/md";
import { CgSmartHomeBoiler } from "react-icons/cg";

export function Svg({ name }: { name: string }) {
  switch (name) {
    case "zoom":
      return <HiMagnifyingGlassCircle />;
    case "vindent":
      return <VscIndent />;
    case "heading":
      return <GoHeading />;
    case "users":
      return <FaUsers />;
    case "changes":
      return <TbExchange />;
    case "create-user":
      return <MdManageAccounts />;
    case "products":
      return <CgSmartHomeBoiler />;
    case "logout":
      return <MdLogout />;
    case "group":
      return <FaLayerGroup />;
    default:
      return <AiOutlineStop />;
  }
}
