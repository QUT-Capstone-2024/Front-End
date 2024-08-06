import React from "react";

type SpacerProps = {
    height?: number;
};

const Spacer: React.FC<SpacerProps> = ({ height = 2 }) => {
    return <div style={{ height: `${height}rem` }} />;
};

export default Spacer;