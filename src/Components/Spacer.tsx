import React from "react";

type SpacerProps = {
    height?: number;
    className?: string;
};

const Spacer: React.FC<SpacerProps> = ({ height = 2, className }) => {
    return <div style={{ height: `${height}rem` }} className={className} />;
};

export default Spacer;