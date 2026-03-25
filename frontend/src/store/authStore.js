import {create} from 'zustand';
import axios from 'axios';

export const useAuth=create((set)=>({
    currentUser:null,
    error:null,
    isAuthenticated:false,
    loading:false,
    login:async(userCredObj)=>{
       try{
        set({loading:true,error:null})
        //    make an API call
        let res=await axios.post('http://localhost:3000/user-api/authenticate',userCredObj,{withCredentials:true})
        set({
            loading:false,
            currentUser:res.data.payload,
            isAuthenticated:true
        })
       }catch(err)
       {
           set({
            isAuthenticated:false,
            currentUser:null,
            loading:false,
            error:err.response?.data.error ||"Login Failed"
           })
       }
       },
       logout:async()=>{
       try{
        set({loading:true,error:null})
        //    make an API call
        await axios.get('http://localhost:3000/user-api/logout',{withCredentials:true})
        set({
            loading:false,
            currentUser:null,
            isAuthenticated:false
        })
       }catch(err)
       {
           set({
            isAuthenticated:false,
            currentUser:null,
            loading:false,
            error:err.response?.data.error ||"Logout Failed"
           })
       }

       },
       refreshToken: async () => {
        try {
          const res = await axios.post('http://localhost:3000/user-api/refresh', {}, { withCredentials: true });
          set({
            currentUser: res.data.payload,
            isAuthenticated: true
          });
          return res.data;
        } catch (err) {
          set({
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data.error || "Token refresh failed"
          });
          throw err;
        }
      }
    })
)