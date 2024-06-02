import React from "react";
import { Button, Alert as MuiAlert } from "@mui/material";

type CustomAlertProps = {
  type?: "info" | "warning" | "error" | "success";
  message: React.ReactNode;
  style?: React.CSSProperties;
  withButton?: boolean;
  buttonLabel?: string;
  onClose?: () => void;
  isVisible?: boolean;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  type: alertType,
  message: children,
  style,
  onClose,
  withButton = false,
  buttonLabel,
  isVisible = false,
}) => {
  const action = withButton ? (
    <Button color="inherit" size="small" onClick={onClose}>
      {buttonLabel || "Close"}
    </Button>
  ) : null;

  return (
    <div style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
      <MuiAlert
        variant="filled"
        severity={alertType || 'info'}
        sx={style}
        onClose={withButton ? onClose : undefined}
        action={action}
      >
        {children}
      </MuiAlert>
    </div>
  );
};

export default CustomAlert;
