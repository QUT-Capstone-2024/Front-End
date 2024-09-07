import React from "react";
import "../Styles/Popover.scss";

interface PopoverProps {
  content: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  type?: 'gallery' | 'hero' | 'property-card' | 'thumbnail';
}

const Popover: React.FC<PopoverProps> = ({ content, visible, onClose, type = 'gallery' }) => {
  if (!visible) return null;

  return (
      <div className={`popover-overlay ${type}`} onClick={onClose}>
        <div className={`popover-content ${type}`}>{content}</div>
      </div>
  );
};

export default Popover;
