import React from 'react';
import { useCheckAuth } from "../Hooks/useCheckAuth";

import './DeleteModalContent.scss';

interface DeleteModalContentProps {
  type?: 'property' | 'user' | 'image';
}

const DeleteModalContent: React.FC<DeleteModalContentProps> = ({type = "property"}) => {
  const { userType } = useCheckAuth();
  const isGod = userType === 'HARBINGER';

  return (
    <div className='delete-content-container'>
      {isGod ? 
        <>
          <h3>Please confirm that you want to delete this {type}</h3> 
          <p>WARNING:</p>
          <p>This action will permanantely remove the {type} from the database.</p>
        </>
            :
        <>
          <h3>Are you sure you want to remove this {type}?</h3>
          <p>WARNING:</p>
          <p>This action will archive the {type} in VisionLOGIC's database.
            <br />You may require admin assistance to revert this action.
          </p>
        </>
      }
    </div>
  );
};

export default DeleteModalContent;