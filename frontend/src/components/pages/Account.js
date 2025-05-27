import React, { useState, useEffect, lazy } from "react";
// Import new queries/mutations from UserQueries.js
import { GET_SELF_USER_PROFILE, UPDATE_PROFILE_IMAGE_MUTATION } from "../../UserQueries"; 
import { useQuery, useMutation } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
// useRecoilValue might still be needed for auth token or initial user data if not refetched immediately
import { useSetRecoilState, useResetRecoilState } from "recoil"; 
import { alertAtom } from "../../atoms"; // Keep alertAtom
// Posts display will be removed from this component for now
// const Posts = lazy(() => import("../post/Posts")); 
const AccountInfo = lazy(() => import("../layout/AccountInfo"));

const Account = () => {
  // Fetch self user data using the new query
  const { loading: userLoading, data: userData, error: userError, refetch: refetchUserData } = useQuery(GET_SELF_USER_PROFILE);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);

  const [updateProfileImageMutation] = useMutation(UPDATE_PROFILE_IMAGE_MUTATION, {
    onCompleted: (data) => {
      setIsUploading(false);
      setAlert({ message: "Profile image updated successfully!", type: "success" });
      // The cache update for GET_SELF_USER_PROFILE will be handled by refetchUserData
      refetchUserData(); 
    },
    onError: (error) => {
      setIsUploading(false);
      console.error("Error updating profile image:", error);
      const message = error.graphQLErrors?.[0]?.message || error.message || "Failed to update profile image.";
      setAlert({ message, type: "error" });
    },
    // Example of direct cache update (alternative to refetch, if mutation returns enough data)
    // update(cache, { data: { updateProfileImage: updatedUser } }) {
    //   try {
    //     const existingUserData = cache.readQuery({ query: GET_SELF_USER_PROFILE });
    //     if (existingUserData && updatedUser) {
    //       cache.writeQuery({
    //         query: GET_SELF_USER_PROFILE,
    //         data: { me: { ...existingUserData.me, profile_image: updatedUser.profile_image } },
    //       });
    //     }
    //   } catch (e) {
    //     console.error("Error updating cache for profile image:", e);
    //   }
    // }
  });

  useEffect(() => {
    removeAlert();
  }, [removeAlert]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImageUpload = () => {
    if (selectedFile) {
      setIsUploading(true);
      removeAlert();
      updateProfileImageMutation({ variables: { file: selectedFile } });
    } else {
      setAlert({ message: "Please select a file first.", type: "info" });
    }
  };

  if (userLoading) {
    return (
      <div className="spinner" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)'}}>
        <Spinner size={50} style={{ margin: "auto" }} />
      </div>
    );
  }

  if (userError) {
    console.error("Error fetching user data:", userError);
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Error loading profile. Details: {userError.message}</p>;
  }
  
  // GET_SELF_USER_PROFILE returns { me: { ... } }
  const currentUserData = userData ? userData.me : null;

  return (
    <>
      {currentUserData ? (
        // AccountInfo needs to be adapted to receive 'currentUserData' (the 'me' object)
        // and display its fields (e.g., username, email, bio, profile_image)
        <AccountInfo user_data={currentUserData} /> 
      ) : (
        !userLoading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Could not load user profile data.</p>
      )}

      <div style={{ padding: '20px', maxWidth: '500px', margin: '30px auto', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Profile Image</h4>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ 
            marginBottom: '15px', 
            display: 'block', 
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }} 
        />
        <button 
          onClick={handleImageUpload} 
          disabled={!selectedFile || isUploading} 
          className="btn btn-primary" // Assuming Bootstrap or similar for styling
          style={{display: 'block', width: '100%', padding: '10px'}}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Display of user's posts is removed from this component. */}
    </>
  );
};

export default Account;
