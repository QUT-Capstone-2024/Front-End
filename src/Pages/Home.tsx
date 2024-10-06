import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import { selectProperty } from '../Redux/Slices/propertySlice'; 
import { getUserCollections, getAllCollections, getUserById } from '../Services';
import { PropertyCard, SmallDisplayCard, SearchBar, Spacer, AddPropertyCard, UpdateForm, CustomButton } from '../Components';
import { useCheckAuth } from '../Hooks/useCheckAuth';
import { getHeroImage } from '../HelperFunctions/utils';
import { 
  Add as PlusIcon,
  Remove as MinusIcon,
  AccountCircle as UserIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import './PropertiesHome.scss';
import { UserWithId } from '../types';


interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const userId = useSelector((state: RootState) => state.user.userDetails?.id);
  const token = useSelector((state: RootState) => state.user.token);
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const { isAdmin } = useCheckAuth();

  // Component state
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false); 
  const [userFormData, setUserFormData] = useState<any>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);


  const handleUpdate = (id: number, updatedUser: Partial<UserWithId>) => {
    setUserFormData((prev: { id: number; }) => (prev && prev.id === id ? { ...prev, ...updatedUser } : prev));
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token || !userId) {
        setError('User not authenticated');
        return;
      }
      try {
        const fetchedUserDetails = await getUserById(userId, token);
        setUserFormData(fetchedUserDetails);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
  
    fetchUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  useEffect(() => {
    const fetchProperties = async () => {
      if (!token) {
        setError('User not authenticated');
        return;
      }

      try {
        setLoading(true);
        let fetchedCollections: any[] = [];

        if (isAdmin) {
          // Admin users fetch all collections
          fetchedCollections = await getAllCollections(token);
        } else if (userId) {
          // Non-admin users fetch only their collections
          fetchedCollections = await getUserCollections(userId, token);
        }

        if (fetchedCollections.length === 0) {
          setIsNewUser(true);
        } else {
          setProperties(fetchedCollections);
        }

        if (fetchedCollections.length > 0 && !selectedPropertyId) {
          // If there's no selected property yet, select the first one by default
          dispatch(selectProperty({
            propertyId: fetchedCollections[0].id,
            propertyAddress: fetchedCollections[0].propertyAddress,
            propertyDescription: fetchedCollections[0].propertyDescription,
            propertySize: fetchedCollections[0].propertySize,
            externalPropertySize: fetchedCollections[0].externalPropertySize,
            bedrooms: fetchedCollections[0].bedrooms,
            bathrooms: fetchedCollections[0].bathrooms,
            parkingSpaces: fetchedCollections[0].parkingSpaces,
            propertyType: fetchedCollections[0].propertyType,
            approvalStatus: fetchedCollections[0].approvalStatus,
          }));
        }

      } catch (err: any) {
        console.error(err.message.includes('404'));
        if (err.message && err.message.includes('404')) {
        setIsNewUser(true);  // Assume new user if 404
        } else {
          setError('Failed to fetch properties');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [dispatch, userId, token, isAdmin, selectedPropertyId]);

  // Get selected property from properties list based on selectedPropertyId
  const selectedProperty = properties.find((property) => property.id === selectedPropertyId);

  const getHeroImageForProperty = (property: any) => {
    return getHeroImage(property.images); // Pass the images array to the helper function
  };
  
  // Event handler for selecting a property
  const handleCardClick = (property: any) => {
    dispatch(selectProperty({
      propertyId: property.id,
      propertyAddress: property.propertyAddress,
      propertyDescription: property.propertyDescription,
      propertySize: property.propertySize,
      externalPropertySize: property.externalPropertySize,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parkingSpaces: property.parkingSpaces,
      propertyType: property.propertyType,
      approvalStatus: property.approvalStatus,
    }));
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  if (isNewUser) {
    return (
      <div>
        <div className="new-user-container">
          <h2>Welcome to VisionCORE!</h2>
          <p>{user.userDetails?.name}, claim a property below to get started ...</p>
          <AddPropertyCard />
        </div>
        <div>
          {!isAdmin && user?.userDetails ? (
            <div className="update-profile-section wide-screen-only" >
              <UpdateForm user={userFormData} onUpdate={handleUpdate} onCancel={() => null}/>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Spacer height={2} />
      <div className="admin-home-container">
        <div className="property-search-container">

          {/* Mobile / Tablet claim button */}
          {!isAdmin && 
            <div className='mobile-tablet-only'>
              <Spacer height={1} />
              <AddPropertyCard />
            </div>
          }

          {/* Mobile / Tablet Search */}
          <div className='mobile-tablet-only' style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
            <CustomButton
                buttonType='successButton'
                label={isAdmin? 'Find a property' : 'Show my properties'}
                withIcon='right'
                icon={!showSearch ?
                  <PlusIcon sx={{ marginLeft: '10px' }}/>
                    :
                  <MinusIcon sx={{ marginLeft: '10px' }}/>
                }
                onClick={() => setShowSearch(!showSearch)}
                style={{ width: '260px', height: '40px' }}
            />
            {showProfile ?
              <CloseIcon 
                onClick={() => setShowProfile(!showProfile)}
                style={{ fontSize: '42px', color: '#f27a31' }}
              />
              :
              <UserIcon 
                onClick={() => setShowProfile(!showProfile)}
                style={{ fontSize: '42px', color: '#93cdfe' }}/>
            }
          </div>

          <div 
            className='mobile-tablet-only'
            style={{ display: showSearch ? 'block' : 'none' }}
          >
            <Spacer height={1} />
            {isAdmin && <SearchBar placeholder="Search for a property" onSearch={(query) => console.log(query)} />}
            <Spacer height={1} />
            <h2>{isAdmin ? 'All Properties' : 'My Properties'}</h2>
            <Spacer height={0.5} />
            <div className='scrollable-list-container'>
            {properties.map((property: any) => (
                  <SmallDisplayCard
                    image={getHeroImageForProperty(property)}
                    propertyType={property.propertyType}
                    propertyAddress={property.propertyAddress}
                    key={property.id}
                    onClick={() => handleCardClick(property)}
                  />
                ))}
            </div>
          </div>

          {/* Mobile / Tablet User Profile */}
          {!isAdmin && showProfile && user?.userDetails ? (
            <div className="update-profile-section mobile-tablet-only" >
              <UpdateForm user={userFormData} onUpdate={handleUpdate} onCancel={() => null}/>
            </div>
          ) 
          : 
          null}


          {/* Desktop search */}
          <div className='desktop-only'>
            {isAdmin && <SearchBar placeholder="Search for a property" onSearch={(query) => console.log(query)} />}
            {/* Desktop claim button */}
            {!isAdmin && <AddPropertyCard />}
            <Spacer height={1} />
            <h2>{isAdmin ? 'All Properties' : 'My Properties'}</h2>
            <Spacer height={0.5} />
            <div className='scrollable-list-container'>
            {properties.map((property: any) => (
                  <SmallDisplayCard
                    image={getHeroImageForProperty(property)}
                    propertyType={property.propertyType}
                    propertyAddress={property.propertyAddress}
                    key={property.id}
                    onClick={() => handleCardClick(property)}
                  />
                ))}
          </div>
          </div>
        </div>

        {/* Property Card */}
        <div className='selected-property-container'>
          {selectedProperty ? (
              <PropertyCard
                propertyAddress={selectedProperty.propertyAddress}
                collectionId={selectedProperty.id}
                bedrooms={selectedProperty.bedrooms}
                bathrooms={selectedProperty.bathrooms}
                parkingSpaces={selectedProperty.parkingSpaces ?? 0}
                approvalStatus={selectedProperty.approvalStatus}
                propertyType={selectedProperty.propertyType}
                propertyDescription={selectedProperty.propertyDescription}
                internalPropertySize={selectedProperty.propertySize}
                externalPropertySize={selectedProperty.externalPropertySize}
              />
            ) : (
              <div className="empty-property-card">
                <Spacer height={2} />
                <h2>No property selected</h2>
                <div>Select a property to view details</div>
              </div>
            )}
            </div>

          {!isAdmin && user?.userDetails ? (
            <div className="update-profile-section wide-screen-only" >
              <UpdateForm user={userFormData} onUpdate={handleUpdate} onCancel={() => null}/>
            </div>
          ) 
          : 
          null}
      </div>
      <Spacer height={4} />
    </div>
  );
};

export default Home;