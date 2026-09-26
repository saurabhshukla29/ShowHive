const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.updateProfile = async (req, res) => {
	try {
	  const {
		firstName = "",
		lastName = "",
		birthDate = "",
		maritalStatus = "",
		gender = "",
		id
	  } = req.body
    //   console.log("user ",req.user)
	//   const id = req.user.id
  
	  // Find the profile by id
    //   console.log("id ",id)
	  const userDetails = await User.findById(id)
	  const profile = await Profile.findById(userDetails.profileDetails)
	  
	//   let updatedProfile=null;
	//   if (imageSrc) {
	// 	const image = await uploadImageToCloudinary(
	// 		imageSrc,
	// 		process.env.FOLDER_NAME,
	// 		1000,
	// 		1000
	// 	  )
	// 	  console.log(image)
	// 	   updatedProfile = await User.findByIdAndUpdate(
	// 		{ _id:id},
	// 		{ image: image.secure_url },
	// 		{ new: true }
	// 	  )
	// 	// imageUrl = uploadedResponse.secure_url;
	//   }
	  // Update the profile fields
	  profile.birthDate = birthDate
	  profile.gender = gender
      profile.maritalStatus=maritalStatus
      profile.firstName=firstName;
      profile.lastName=lastName;
	  // Save the updated profile
	  await profile.save()
  
	  // Find the updated user details
	  const updatedUserDetails = await User.findById(id)
		.populate("profileDetails")
		.exec()
	  	console.log('updated user Details-> ',updatedUserDetails);
	  return res.status(200).json({
		success: true,
		message: "Profile updated successfully",
		updatedUserDetails
	  });
	} catch (error) {
	  console.log(error)
	  return res.status(500).json({
		success: false,
		error: error.message,
	  })
	}
  }
  

exports.getAllUserDetails = async (req, res) => {
	try {
		const {id} = req.body;
		const userDetails = await User.findById(id)
			.populate("profileDetails")
			.exec();
		//console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const {id} = req.body;
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      //console.log('image url -> ',image.secure_url)
      const updatedProfile = await User.findByIdAndUpdate(
        id,
        { image: image.secure_url },
        { new: true }
      )
	  //console.log('updatedProfile -> ',updatedProfile)
     return res.status(200).json({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
		console.log('error in updateDisplayPicture-> ',error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};