import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import 'react-datepicker/dist/react-datepicker.css';
import './Profile.css';
import { profileEndpoints } from '../services/api';
import { apiConnector } from '../services/apiConnector';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from '../Slices/profileSlice';
 import StyledDatePicker from '../services/StyledDatepicker';
import { updateDisplayPicture } from '../services/SettingsAPI';
import { updateProfile } from '../services/SettingsAPI';
const Profile = () => {
  const [birthDate, setBirthDate] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const [isImageUpdated, setIsImageUpdated] = useState(false); // Track if any field is updated
  const { token } = useSelector((state) => state.auth);
  let { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  // Handle image upload
  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImageSrc(e.target.result);
  //       setIsUpdated(true); // Mark as updated
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file)
    if (file) {
      setIsImageUpdated(true);
      setImageFile(file);
      previewFile(file);
    }
  };

  const handleFileUpload = () => {
    try {
      //console.log("uploading...");
      // setLoading(true);
      const id=user._id;
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      formData.append("id", id);
      //console.log("formdata", formData)
      // dispatch(updateDisplayPicture(token, formData))
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        // setLoading(false);
        setIsImageUpdated(false);
      });
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };
  // useEffect(async ()=>{
  //   try {
  //     const id=user._id
  //     const response=await apiConnector("POST",profileEndpoints.GET_USER_DETAILS_API,{id}, {
  //       "Content-Type": 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     });
  //     console.log('response user details-> ',response.data.userDetails)
  //     dispatch(setUser(response.data.userDetails));
  //   } catch (error) {
      
  //   }
  // },[])
  // Update state and mark as updated
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
    setIsUpdated(true);
  };
  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);
  // Save data to the backend
  const handleSave = async () => {
    const id=user._id
    const data = {
      firstName,
      lastName,
      birthDate,
      gender,
      maritalStatus,
      id
    };
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
    setBirthDate(null);
        // setImageSrc(null);
        setFirstName('');
        setLastName('');
        setMaritalStatus('');
        setGender('');
        setIsUpdated(false);
    // try {
    //   const response=await apiConnector("PUT", profileEndpoints.UPDATE_PROFILE_API, JSON.stringify(data), {
    //     "Content-Type": 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   }, null, false);
    //   // const response = await fetch('YOUR_BACKEND_ENDPOINT', {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'Content-Type': 'application/json',
    //   //   },
    //   //   body: JSON.stringify(data),
    //   // });
    //   setIsUpdated(false); // Reset the update status
    //     console.log('response data ',response.data);
        
    //     setBirthDate(null);
    //     // setImageSrc(null);
    //     setFirstName('');
    //     setLastName('');
    //     setMaritalStatus('');
    //     setGender('');
    //   // if (response.ok) {
    //   //   // Handle successful save
    //   //   console.log('Data saved successfully');
        
    //   // } else {
    //   //   // Handle save error
    //   //   console.error('Error saving data');
    //   // }
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  return (
    <div className="profileCont">
      <div className="accDetails">
        <div className="profileSec">
          <Card className="profileCard">
            <Card.Body>
              <label htmlFor="upload-input" className="upload-btn">
                <Card.Img
                  className="profileImage"
                  variant="top"
                  src={previewSource || user?.image || 'https://via.placeholder.com/150'}
                  alt="User Photo"
                />
                <input
                  type="file"
                  id="upload-input"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </Card.Body>
          </Card>
          <div className='textSide'>
          <h1>
  Hi,{' '}
  {user.profileDetails.firstName || user.profileDetails.lastName
    ? `${user.profileDetails.firstName || ''} ${user.profileDetails.lastName || ''}`.trim()
    : 'Guest'}
</h1>
<h3>Welcome to ShowHive!</h3>
</div>
          
        </div>
        <div className='emailAdd'>
          <h4>Email Address: {user.email}</h4>
        </div>
        {isImageUpdated && (
          <div className='saveDiv'>
        <button className="save-btn" onClick={handleFileUpload}>
          Save
        </button>
        </div>
      )}
      </div>
      <div className="eventDetails">
        <h3>Personal Details</h3>
        <div className="eventInput">
          <label>First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleInputChange(setFirstName)}
            placeholder="Enter your First Name"
          />
        </div>
        <div className="eventInput">
          <label>Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleInputChange(setLastName)}
            placeholder="Enter your Last Name"
          />
        </div>
        <div className="eventInput">
          <label>BirthDate:</label>
          <StyledDatePicker 
          selectedDate={birthDate}
          setSelectedDate={setBirthDate}
        />
        </div>
        <div className="eventInput">
          <label>Gender:</label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={gender === 'Male'}
            onChange={() => {
              setGender('Male');
              setIsUpdated(true);
            }}
          />
          Male
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={gender === 'Female'}
            onChange={() => {
              setGender('Female');
              setIsUpdated(true);
            }}
          />
          Female
        </div>
        <div className="eventInput">
          <label>Marital Status:</label>
          <input
            type="radio"
            name="maritalstatus"
            value="yes"
            checked={maritalStatus === 'yes'}
            onChange={() => {
              setMaritalStatus('yes');
              setIsUpdated(true);
            }}
          />
          Yes
          <input
            type="radio"
            name="maritalstatus"
            value="no"
            checked={maritalStatus === 'no'}
            onChange={() => {
              setMaritalStatus('no');
              setIsUpdated(true);
            }}
          />
          No
        </div>
        {isUpdated && (
          <div className='saveDiv'>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
        </div>
      )}
      </div>
     
    </div>
  );
};

export default Profile;
