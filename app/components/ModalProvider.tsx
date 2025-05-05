import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

type ModalContextType = {
  setModal: (content: ReactNode | null) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModal] = useState<ReactNode | null>(null);
  useEffect(() => {
    // console.log(11, modalContent);
  }, [modalContent]);
  return (
    <ModalContext.Provider value={{ setModal }}>
      {children}
      {modalContent &&
        createPortal(
          <div className="modal-overlay">
            <div className="modal-content">{modalContent}</div>
          </div>,
          document.getElementById("modal-root")!
        )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
