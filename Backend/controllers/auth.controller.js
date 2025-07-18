import { genToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

export const signup = async  (req,res) =>{
    const { fullname, email, password } = req.body;
    try {
        //hash password
        if(!email || !fullname || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        if (password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"}); 
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({message: "User already exists with this email"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email,
            fullname: fullname,
            password: hashedPassword
        })

        if(newUser){
            //generate jwt token
            genToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic
            })
        }else{
            return res.status(500).json({message: "Failed to create user"});
        }


    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({message: "Internal server error"});
        
    }
}



export const login = async (req,res) =>{
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }

        //generate jwt token
        genToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            profilePic: user.profilePic
        });
    } catch (error) {
        log("Error in login controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }    
}


export const logout = async (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}


export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message: "Please provide a profile picture"});
        }
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic:uploadResponse.secure_url }, { new: true });
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        log("Error in checkAuth controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}