import { config } from 'dotenv';
import exp from 'express';
import { connect } from 'mongoose'
import cors from 'cors';
import { userRoute } from './APIs/userAPI.js';
import cookieParser from "cookie-parser";

config();
//port
const PORT = process.env.DB_URL || 4000;

const app = exp();
//cors
app.use(cors({origin:["http://localhost:5173"],credentials:true}));
//body parser
app.use(exp.json());
app.use(cookieParser())
//routes
app.use('/user-api', userRoute);


//connect to DB 
const connectDB = async () => {
  try {
   await connect(process.env.DB_URL)
    console.log("Connected To DataBase succesfully")
    // server listen port
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    })

  } catch (err) {
    console.log("error Occured while connecting to DataBase", err)
  }
}

//calling 
connectDB();




//dealing with invalid path
//after checking all the pathsi.e APIs then if not match come to here
app.use((req, res, next) => {
  console.log(req.url);
  res.json({ message: `${req.url} is Invalid path` })
});


app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});