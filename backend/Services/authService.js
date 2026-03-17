import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserTypeModel.js";
import { config } from "dotenv";
config();

//registration function 
export const register = async (userObj) => {
    //Create document
    const userDoc = new UserTypeModel(userObj);
    //validate for empty password 
    await userDoc.validate();
    //hash and replace plain password 
    userDoc.password = await bcrypt.hash(userDoc.password, 10)
    //save 
    const created = await userDoc.save();
    //convert documnet to object to remove password 
    const newUserObj = created.toObject();
    //remove password 
    delete newUserObj.password;
    //return user object without password
    return newUserObj;
}

//authenticate function
export const authenticate = async ({ email, password}) => {
    //check with useer with email and role
    const user = await UserTypeModel.findOne({ email});
    if (!user) {
        const err = new Error("Invalid email");
        err.status = 401;
        throw err;
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const err = new Error("Invalid password");
        err.status = 401;
        throw err;
    } 
    //check is active status
    if (user.isActive===false) {
        const err = new Error("Your account is blocked.please contact Admin");
        err.status = 403; //- 403 permissions or access restrictions.
        throw err;
    } 

    //generate token
    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email },
        process.env.SECRET_KEY, { expiresIn: "1h" });
    const userObj = user.toObject(); // it coverts Doc into plain Javascript
    delete userObj.password; // we never want to send the password back to the client

    return { token, user: userObj }; //  RETURN OBJECT
};
