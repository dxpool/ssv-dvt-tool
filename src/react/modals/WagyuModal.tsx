import { Modal, ModalProps } from "@mui/material";
import React from "react";

interface WagyuModalParams {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper for modal usages to keep consistent styling.
 */
const WagyuModal = ({ children, className, onClose, open }: WagyuModalParams & ModalProps) => (
  <Modal onClose={onClose} open={open}>
    <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center">
      <div className={`tw-flex tw-flex-col tw-bg-backgroundLight tw-rounded-3xl tw-text-center ${className || ""}`}>
        {children}
      </div>
    </div>
  </Modal>
);

export default WagyuModal;