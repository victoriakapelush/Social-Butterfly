/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import '../styles/profile.css'
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeNav from './HomeNav'
import HomeExtra from './HomeExtra'
import EditProfilePopup from './EditProfilePopup'
import NewPost from './NewPost'
import back from '../assets/icons/back.png'
import defaultBackgroundImage from '../assets/images/defaultBackgroundImage.jpg'
import defaultProfileImage from '../assets/images/defaultProfileImage.jpg'

function Profile() {
    const [userData, setUserData] = useState({});
    const [originalUsername, setOriginalUsername] = useState(null);
    const [formattedUsername, setFormattedUsername] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        profileBio: '',
        location: '',
        website: '',
        updatedName: originalUsername,
        profilePicture: null,
        backgroundHeaderImage: null
    });

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = (updatedProfileData) => {
        setIsPopupOpen(false);
        if (updatedProfileData) {
            setProfileData(updatedProfileData);
            setUserData((prevUserData) => ({
                ...prevUserData,
                profile: { ...prevUserData.profile, ...updatedProfileData },
            }));
        }
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                const decodedUsername = decoded.originalUsername.toLowerCase().replace(/\s+/g, '');
                setFormattedUsername(decodedUsername); 

                // Fetch user data directly using decodedUsername
                const response = await axios.get(`http://localhost:3000/profile/${decodedUsername}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                setUserData({ ...response.data });
                console.log(response.data);
                setProfileData({
                    profileBio: response.data.profile.profileBio || '',
                    location: response.data.profile.location || '',
                    website: response.data.profile.website || '',
                    updatedName: response.data.profile.updatedName || '',
                    profilePicture: response.data.profileImage || '',
                    backgroundHeaderImage: response.data.backgroundHeaderImage || ''
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData(); 
    }, []); 
    
     
    useEffect(() => {
        if (userData) {
            console.log('User data:', userData);
        } else {
            console.log('User data is not available.');
        }
    }, [userData]);

    return (
        <div className='flex-row profile-page'>
            <HomeNav />
            <div className='profile-container'>
                <header className='flex-row'>
                    <Link to='/home' className='flex-row profile-icon-back'>
                        <img src={back}/>
                    </Link>
                    <div className='flex-column profile-header-name'>
                        {profileData && <h2>{profileData.updatedName}</h2>}                        
                        {userData && userData.profile && <span>{userData.profile.posts} posts</span>}
                    </div>
                </header>
                <div className='background-image-holder'>
                    {userData.profile && userData.profile.backgroundHeaderImage ? (
                        <img src={`http://localhost:3000/${userData.profile.backgroundHeaderImage}`} alt="Profile Header Background Picture" />
                    ) : (
                        <img src={defaultBackgroundImage} alt="Default Profile Header Background Picture" />
                    )}
                </div>
                    <div className='profile-photo-container flex-row'>
                    {userData.profile && userData.profile.profilePicture ? (
                        <img src={`http://localhost:3000/${userData.profile.profilePicture}`} alt="Profile Picture" />
                        ) : (
                        <img src={defaultProfileImage} alt="Default Profile Picture" />
                        )}
                    <button onClick={handleOpenPopup} className='edit-profile-btn radius'>Edit profile</button>
                    {isPopupOpen && <EditProfilePopup profileData={profileData} setProfileData={setProfileData} onClose={handleClosePopup} onSave={handleClosePopup}/>}
                    <div className='flex-column personal-info-section'>
                        {userData && userData.profile && <span className='profile-user-name'>{userData.profile.updatedName}</span>}
                        {userData.formattedUsername && <span className='user-tag'>@{userData.formattedUsername}</span>}
                        {profileData && profileData.profileBio && (
                            <p className='user-profile-description'>{profileData.profileBio}</p>
                        )}
                        <div className='flex-row location-date-container'>
                        {userData && userData.profile && userData.profile.location && (
                            <>
                                <div className='flex-row location-container'>
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <g><path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path></g>
                                    </svg>
                                    <span>{userData.profile.location}</span>
                                </div>
                                </>
                            )}
                        {userData && userData.profile && userData.profile.website && (
                        <>
                            <div className='flex-row location-container'>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" ><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg>
                                    <span>
                                        <a href={userData.profile.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline"}}>
                                            {userData.profile.website}
                                        </a>
                                    </span>
                                </div>
                                </>)}
                            <div className='flex-row location-container'>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path></g></svg>                            
                                {userData.profile ? (<span>{userData.profile.registrationDate}</span>) : <span>No registration date available</span>}                            </div>
                        </div>
                        <div className='flex-row following-container'>
                            {userData.profile && (
                                <span className='following-number'>
                                    {userData.profile.following ? userData.profile.following : '0'}{' '}
                                    <span className='following-grey'>Following</span>
                                </span>
                            )}
                            {userData && userData.profile && (
                                <span className='following-number'>
                                    {userData.profile.followers ? userData.profile.followers : '0'}{' '} 
                                    <span className='following-grey'>Followers</span>
                                </span>
                            )}
                        </div>
                        <span className='followed-not'>Not followed by anyone you're following</span>
                    </div>
                </div>
                <nav className='profile-nav flex-row'>
                    <div className='blue-underline'>
                        <Link className='profile-nav-link for-you-tab'>Posts</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className='profile-nav-link for-you-tab'>Replies</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className='profile-nav-link for-you-tab'>Subs</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className='profile-nav-link for-you-tab'>Highlights</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className='profile-nav-link for-you-tab'>Media</Link>
                    </div>
                </nav>
                <div className='profile-post'>
                    <NewPost />
                    <NewPost />
                    <NewPost />
                </div>
            </div>
            <HomeExtra />
        </div>
    )
}

export default Profile