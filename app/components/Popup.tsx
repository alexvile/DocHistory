import { ReactNode } from "react";
import { useModal } from "~/components/ModalProvider";

export default function Popup({ children }: { children: ReactNode }) {
  const { setModal } = useModal();
  return (
    <div className="popup">
      <h2>Привіт, це попап!</h2>
      {children}
      <button className="popup__close" onClick={() => setModal(null)}>Закрити</button>
    </div>
  );
}
