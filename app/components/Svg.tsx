import { AiOutlineStop } from "react-icons/ai";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { VscIndent } from "react-icons/vsc";
import { GoHeading } from "react-icons/go";
import { FaLayerGroup, FaUsers, FaRegClock, FaPlus, FaMinus, FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { FaCircleMinus, FaCirclePlus, FaPencil } from "react-icons/fa6";
import { TbExchange } from "react-icons/tb";
import { MdManageAccounts, MdLogout, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { CgSmartHomeBoiler } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";

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
    case "change-updated":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="200px" height="200px" viewBox="2 2 20 20">
          <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM10,16,7,17l1-3,7-7,2,2Z" />
        </svg>
      );
    default:
      return <AiOutlineStop />;
  }
}
