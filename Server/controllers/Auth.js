const User= require('../models/User');
const Profile=require('../models/Profile');
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.SignUp= async (req,res)=>{

    try {
        const {email,otp}=req.body;

        if(!email || !otp){
            return res.status(403).json({
                success:false,
                message:'All Feilds are required'
            })
        }

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			return res.status(403).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			return res.status(403).json({
				success: false,
				message: "The OTP doesn't match",
			});
		}

		let user= await User.findOne({email})?.populate("profileDetails").exec();

		if(user){
			const token = jwt.sign(
				{ email: user.email, id: user._id},
				process.env.JWT_SECRET,
				{
					expiresIn: "7d",
				}
			);
			// console.log('token created-> ',token);
			
			return res.status(200).json({
				success: true,
				user,
				token,
				message: "User is already registered ",
			})
		}

		const profileDetails = await Profile.create({
			firstName: null,
			lastName:null,
			birthDate: null,
			gender: null,
			maritalStatus: null
		});
		 user = await User.create({
			email,
			profileDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${profileDetails.firstName || 'Anonymous'}&${profileDetails.lastName || 'User'}`,
		});

		user = await user.populate("profileDetails");

		const token = jwt.sign(
			{ email: user.email, id: user._id},
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		
		user.token = token;
		return res.status(200).json({
			success: true,
			token,
			user,
			message: `User Login Success`,
		});

    } catch (error) {
		console.error('Error during sign-up:', error); 
        return res.status(500).json({
			success: false,
			message: "Something went wrong while signing up the user",
		});
    }
}

exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};


