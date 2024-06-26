const User = require('../models/User');
const Profile = require('../models/Profile');

const addUserProfile = async (req, res) => {
    const { profileBio, location, website, updatedName } = req.body;
    const currentUser = req.user.originalUsername;
    try {
        let updateFields = {};

        // Check if files were uploaded and set image paths accordingly
        if (req.files) {
            if (req.files.profilePicture) {
                updateFields['profile.profilePicture'] = req.files.profilePicture[0].path;
            }
            if (req.files.backgroundHeaderImage) {
                updateFields['profile.backgroundHeaderImage'] = req.files.backgroundHeaderImage[0].path;
            }
        }

        // Update other fields only if they are provided in the request
        if (profileBio) updateFields['profile.profileBio'] = profileBio;
        if (location) updateFields['profile.location'] = location;
        if (website) updateFields['profile.website'] = website;
        updateFields['profile.updatedName'] = updatedName || currentUser;
        
        const user = await User.findOneAndUpdate(
            { originalUsername: currentUser },
            { $set: updateFields },
            { new: true, upsert: false, runValidators: true }
        ).populate('profile');

        if (!user || !user.profile) {
            return res.status(404).send('User or user profile not found');
        }

        res.status(200).send('User profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};





const getUserProfile = async (req, res) => {
    const currentUser = req.user.originalUsername;
    try {
        const userProfile = await User.findOne({ originalUsername: currentUser });
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userProfile);    
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { addUserProfile, getUserProfile };