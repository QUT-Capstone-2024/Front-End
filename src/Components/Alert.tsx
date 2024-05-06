import React from "react";
import { Button, Alert as MuiAlert } from "@mui/material";

type CustomAlertProps = {
  alertType?: "info" | "warning" | "error" | "success";
  children: React.ReactNode;
  style: React.CSSProperties;
  withButton?: boolean;
  buttonLabel?: string;
  onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  alertType,
  children,
  style,
  onClose,
  withButton = false,
  buttonLabel
}) => {
  const action = withButton ? (
    <Button color="inherit" size="small" onClick={onClose}>
      {buttonLabel || 'Close'}
    </Button>
  ) : null;

  switch (alertType) {
    case "info":
      return (
        <MuiAlert
          variant="filled"
          severity="info"
          sx={style}
          onClose={withButton ? onClose : undefined} 
          action={action}
        >
          {children}
        </MuiAlert>
      );

    case "warning":
      return (
        <MuiAlert
          variant="filled"
          severity="warning"
          sx={style}
          onClose={withButton ? onClose : undefined} 
          action={action}
        >
          {children}
        </MuiAlert>
      );

    case "error":
      return (
        <MuiAlert
          variant="filled"
          severity="error"
          sx={style}
          onClose={withButton ? onClose : undefined} 
          action={action}
        >
          {children}
        </MuiAlert>
      );

    case "success":
      return (
        <MuiAlert
          variant="filled"
          severity="success"
          sx={style}
          onClose={withButton ? onClose : undefined} 
          action={action}
        >
          {children}
        </MuiAlert>
      );

    default:
      return null;
  }
};

export default CustomAlert;
