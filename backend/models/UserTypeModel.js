import {Schema,model} from 'mongoose'

//here we can select the user type i.e it may  user,author,admin
//define user schema with properties
const userSchema=new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"],
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    profileImageUrl:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true  //whenever the user registed/login by default isActive set to true
    }
},{
    timestamps:true, // display the time and date of user created
    strict:"throw",  //extra fields/data send error thrown
    versionKey:false  
})


export const UserTypeModel=model("user",userSchema);
//db creates users collection 