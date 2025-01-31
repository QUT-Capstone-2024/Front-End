import { styled } from "@mui/material/styles";
import Switch, { switchClasses } from "@mui/material/Switch";

const SwitchTextTrack = styled(Switch)({
  width: 80,
  height: 48,
  padding: 8,
  [`& .${switchClasses.switchBase}`]: {
    padding: 11,
    color: "#ff6a00",
  },
  [`& .${switchClasses.thumb}`]: {
    width: 26,
    height: 26,
    backgroundColor: "#808080",
  },
  [`& .${switchClasses.track}`]: {
    background: "#d5dde4",
    opacity: "1 !important",
    borderRadius: 20,
    position: "relative",
    "&:before, &:after": {
      display: "inline-block",
      position: "absolute",
      top: "50%",
      width: "50%",
      transform: "translateY(-50%)",
      textAlign: "center",
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    "&:before": {
      color: "white",
      content: '"YES"',
      left: 3,
      opacity: 0,
    },
    "&:after": {
      color: "#808080",
      content: '"NO"',
      right: 3,
    },
  },
  [`& .${switchClasses.checked}`]: {
    [`&.${switchClasses.switchBase}`]: {
      color: "#185a9d",
      transform: "translateX(32px)",
      "&:hover": {
        backgroundColor: "rgba(24,90,257,0.08)",
      },
    },
    [`& .${switchClasses.thumb}`]: {
      backgroundColor: "#fff",
    },
    [`& + .${switchClasses.track}`]: {
      background: "#0b517d",
      "&:before": {
        opacity: 1,
      },
      "&:after": {
        opacity: 0,
      },
    },
  },
});

export default SwitchTextTrack;