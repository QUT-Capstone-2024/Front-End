import React from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface AddPropertyCardProps {
  title?: string;
  text?: string;
  onClick?: () => void;
};

const AddPropertyCard: React.FC<AddPropertyCardProps> = ({ 
  title = 'Add New Property', 
  text = 'Find your home',
  onClick }) => {
    return (
        <div className="add-property-card-container" onClick={onClick}>
            <AddCircleOutlineIcon className="add-icon" sx={{ height: '60px', width: '60px', color: '#f27a31' }} />
            <div className="small-display-card-text">
                <p className="title">{title}</p>
                <p className="text">{text}</p>
            </div>
        </div>
    );
};

export default AddPropertyCard;
