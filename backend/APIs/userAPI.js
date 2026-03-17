import exp from 'express';
import { authenticate } from '../Services/authService.js';
import { register } from '../Services/authService.js';
import { UserTypeModel } from '../models/UserTypeModel.js';
import bcrypt from 'bcryptjs'

export const userRoute=exp.Router();
//Register user 
userRoute.post("/users",async (req,res)=>{
    //get user obj from req 
    let userObj=req.body; 
    //call register 
    const newUserObj=await register({...userObj});
    //send response
    res.status(201).json({
        message:"user created successfully",
        payload:newUserObj
})

})
//login
//public route
userRoute.post("/authenticate", async (req, res) => {
    //get user cred object 
    let userCred = req.body;
    //call authenticate
    let { token, user } = await authenticate(userCred);
    //save token in cookie
    // set the token to the header of the res obj
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });
    //send response
    res.status(200).json({
        message: "user authenticated successfully",
        payload: user
    })

})


//logout/clear the cookies  
userRoute.get('/logout', async (req, res) => {
    //clear the cookie named 'token'
    res.clearCookie('token', {  //here the details like httpOnly,secure,sameSite should match the created token
        httpOnly: true,
        secure: false, //it can work on both http and https
        sameSite: 'lax' //medium restrictions
    });
    res.status(200).json({ message: "logged out succesfully" });
})



//change password
userRoute.put('/change-password', async (req, res) => {
    //get current password and new password
    let { email, password, newpassword } = req.body;
    //check the current password is correct or not
    let user = await UserTypeModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "user email is not exist" });
    }

    let passwordAvailable = await bcrypt.compare(password, user.password)
    if (!passwordAvailable) {
        return res.status(401).json({ message: "password not matches" });
    }

    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    //2.we can also do like user.password=hashedNewPassword user.password.save();
    // console.log(hashedNewPassword);
    //replace current password with new password
    let updatedPassword = await UserTypeModel.findByIdAndUpdate(user._id, { $set: { password: hashedNewPassword } }, { new: true })
    
    //console.log(updatedPassword);
    //send res
    res.status(200).json({
        message: "password updated successfully",
        payload: updatedPassword
    })

})

