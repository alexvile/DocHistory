import { AiOutlineStop } from "react-icons/ai";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { VscIndent } from "react-icons/vsc";
import { GoHeading } from "react-icons/go";
import { FaLayerGroup, FaUsers, FaRegClock, FaPlus, FaMinus, FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { FaCircleMinus, FaCirclePlus, FaPencil } from "react-icons/fa6";
import { TbExchange } from "react-icons/tb";
import { MdManageAccounts, MdLogout, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdChangeCircle } from "react-icons/md";
import { CgSmartHomeBoiler } from "react-icons/cg";
import { IoIosCheckmark, IoIosHelpCircleOutline } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";

// todo - copy svg to save memory
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
    case "pencil":
      return <FaPencil />;
    case "clock":
      return <FaRegClock />;
    case "back":
      return <MdKeyboardArrowLeft />;
    case "next":
      return <MdKeyboardArrowRight />;
    case "help":
      return <IoIosHelpCircleOutline />;
    case "change-added":
      return <FaCirclePlus />;
    case "change-removed":
      return <FaCircleMinus />;
    case "change-modified":
      return (
        <svg viewBox="2 2 20 20" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.06 17v-2.01H12c-1.28 0-2.56-.49-3.54-1.46a5.006 5.006 0 0 1-.64-6.29l1.1 1.1c-.71 1.33-.53 3.01.59 4.13.7.7 1.62 1.03 2.54 1.01v-2.14l2.83 2.83L12.06 19zm4.11-4.24-1.1-1.1c.71-1.33.53-3.01-.59-4.13A3.482 3.482 0 0 0 12 8.5h-.06v2.15L9.11 7.83 11.94 5v2.02c1.3-.02 2.61.45 3.6 1.45 1.7 1.7 1.91 4.35.63 6.29z" />
        </svg>
      );
    case "checkmark":
      return <IoCheckmarkOutline />;
    default:
      return <AiOutlineStop />;
  }
}
