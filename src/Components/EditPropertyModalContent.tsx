import React, { useEffect, useState } from "react";
import { CustomButton, TextInput, NumberInput, Spacer } from "./";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { updateCollection } from "../Services";

interface EditPropertyModalContentProps {
  toggleModal: () => void;
  propertyAddress: string;
  propertyDescription: string;
}

const EditPropertyModalContent: React.FC<EditPropertyModalContentProps> = ({
  toggleModal,
  propertyAddress,
}) => {

  // Access the updated property details from the Redux state
  const propertyDetails = useSelector(
    (state: RootState) => state.currentProperty
  );
  const collectionID = propertyDetails.selectedPropertyId;
  const token = useSelector((state: RootState) => state.user.token);

  // Local state for editable fields, initialized from Redux state
  const [bedrooms, setBedrooms] = useState<number>(
    propertyDetails.bedrooms || 0
  );
  const [bathrooms, setBathrooms] = useState<number>(
    propertyDetails.bathrooms || 0
  );
  const [parkingSpaces, setParkingSpaces] = useState<number>(
    propertyDetails.parking || 0
  );
  const [internalPropertySize, setInternalPropertySize] = useState<number>(
    propertyDetails.propertySize || 0
  );
  const [externalPropertySize, setExternalPropertySize] = useState<number>(0);
  const [description, setDescription] = useState<string>(
    propertyDetails.propertyDescription || ""
  );

  // Effect hook to update local state whenever the Redux state updates
  useEffect(() => {
    setBedrooms(propertyDetails.bedrooms || 0);
    setBathrooms(propertyDetails.bathrooms || 0);
    setParkingSpaces(propertyDetails.parking || 0);
    setInternalPropertySize(propertyDetails.propertySize || 0);
    setExternalPropertySize(0); // Update if needed
    setDescription(propertyDetails.propertyDescription || "");
  }, [propertyDetails]);

  const handleUpdate = async () => {
    const updateData = {
      bedrooms,
      bathrooms,
      parkingSpaces,
      internalPropertySize,
      externalPropertySize,
      description,
    };

    try {
      const updatedData = await updateCollection(
        collectionID!,
        updateData,
        token!
      );
      window.location.reload();

      console.log("Success:", updatedData);
      toggleModal(); // Close the modal
    } catch (err) {
      console.error("Error updating property details:", err);
      alert("Failed to update the property details.");
    }
  };

  return (
    <div
      style={{
        minWidth: "400px",
        maxWidth: "450px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>{propertyAddress}</h2>
      <Spacer height={1} />
      <form>
        <div style={{ marginBottom: "20px" }}>
          <NumberInput
            label="Bedrooms"
            icon="Bedrooms"
            value={bedrooms}
            onChange={(event) => setBedrooms(parseInt(event.target.value))}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <NumberInput
            label="Bathrooms"
            icon="Bathrooms"
            value={bathrooms}
            onChange={(event) => setBathrooms(parseInt(event.target.value))}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <NumberInput
            label="Parking Spaces"
            icon="ParkingSpaces"
            value={parkingSpaces}
            onChange={(event) => setParkingSpaces(parseInt(event.target.value))}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <NumberInput
            label="Internal Property Size"
            icon="InternalPropertySize"
            value={internalPropertySize}
            onChange={(event) =>
              setInternalPropertySize(parseInt(event.target.value))
            }
            editable={true}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <NumberInput
            label="External Property Size"
            icon="ExternalPropertySize"
            value={externalPropertySize}
            onChange={(event) =>
              setExternalPropertySize(parseInt(event.target.value))
            }
            editable={true}
          />
        </div>

        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <TextInput
            size="large"
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
      </form>

      <div style={{ display: "flex", gap: "40px", justifyContent: "center" }}>
        <CustomButton label="Update" onClick={handleUpdate} />
        <CustomButton
          buttonType="cancelButton"
          label="Cancel"
          onClick={toggleModal}
        />
      </div>
    </div>
  );
};

export default EditPropertyModalContent;
