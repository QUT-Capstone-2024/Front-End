import React from "react";
import BathtubIcon from "@mui/icons-material/Bathtub";
import KingBedIcon from "@mui/icons-material/KingBed";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CropFreeIcon from "@mui/icons-material/CropFree";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { colors } from "@mui/material";

interface NumberInputProps {
  label?: string;
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  size?: "small" | "medium" | "large";
  editable?: boolean;
  min?: number;
  max?: number;
  withIcon?: boolean;
  icon?:
    | "Bedrooms"
    | "Bathrooms"
    | "ParkingSpaces"
    | "InternalPropertySize"
    | "ExternalPropertySize";
}

const getIcon = (icon: string) => {
  switch (icon) {
    case "Bedrooms":
      return <KingBedIcon />;
    case "Bathrooms":
      return <BathtubIcon />;
    case "ParkingSpaces":
      return <DirectionsCarIcon />;
    case "InternalPropertySize":
      return <CropFreeIcon />;
    case "ExternalPropertySize":
      return <AspectRatioIcon />;
    default:
      return null;
  }
};

const NumberInput: React.FC<NumberInputProps> = ({
  label = "Need a label here?",
  value,
  onChange,
  error,
  helperText,
  className,
  size,
  editable = true,
  min = 0,
  max,
  withIcon = true,
  icon,
}) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "20px"
    }}>
      <label className={`text-input-label number ${className}`}>{label}</label>
      <div className={`text-input-container number ${className}`} style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
        {withIcon && icon && (
          <span className="number-icon" style={{ marginRight: "10px" }}>
            {getIcon(icon)}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={onChange}
          className={`text-input number ${error ? "input-error" : ""} ${size}`}
          readOnly={!editable}
          min={min}
          max={max}
          onFocus={(e) => {
            if (editable) {
              e.target.classList.add("input-focused");
            }
          }}
          onBlur={(e) => e.target.classList.remove("input-focused")}
        />
        {helperText && (
          <small className={`helper-text ${error ? "error-text" : ""}`}>
            {helperText}
          </small>
        )}
      </div>
    </div>
  );
};

export default NumberInput;
