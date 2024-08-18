import React from "react";
import "./Popover.scss";

interface PopoverProps {
  content: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  type?: 'gallery' | 'hero';
}

const Popover: React.FC<PopoverProps> = ({ content, visible, onClose, type = 'gallery' }) => {
  if (!visible) return null;

  return (
      <div className={`popover-overlay ${type}`} onClick={onClose}>
        <div className="popover-content">{content}</div>
      </div>
  );
};

export default Popover;
