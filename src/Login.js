import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import { Navigate, useNavigate,Link } from "react-router-dom";
import * as yup from "yup";
import { API } from './Global';

const LoginValidationSchema = yup.object({
   
    email:yup.string().required(),
    password:yup.string().required()
       
   });
function Login(){
    
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
           
            email:"",
            password:""
        },
   
        validationSchema:LoginValidationSchema,

       onSubmit:async (values)=>{
       
      const data = await fetch(`${API}/user/login`,{
            method:"POST",
            body:JSON.stringify(values),
            headers:{"Content-type": "application/json"},
      
           })
        const result = await data.json(); 
        
        if(data.status == 200){
           
            
            localStorage.setItem("token",result.token);
            localStorage.setItem("user",result.verifyUser.userName)
            localStorage.setItem("userId",result.verifyUser._id)
            alert(result.message)
            navigate("/blogs");
           
         }else {
           
            alert(result.message)
          }
         
    }
    });
     
    return(
        <div >
            
         <form className='register-container'onSubmit={formik.handleSubmit}>
         <h3 className='register'>Login</h3>
          <TextField id="outlined-basic" 
          label="email" 
          variant="outlined"
          value={formik.values.email}
            onChange={formik.handleChange}
            name="email" 
            onBlur={formik.handleBlur} 
            error={formik.touched.email && formik.errors.email}
            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}/>

          <TextField 
          id="outlined-basic" 
          label="password" 
          variant="outlined"
          value={formik.values.password}
            onChange={formik.handleChange}
            name="password" 
            onBlur={formik.handleBlur} 
            error={formik.touched.password && formik.errors.password}
            helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}/>
          <Button type="submit" variant="outlined">submit</Button>
          <p>If you don't have an account <Link to="/register" className='link'>Click-Here</Link></p>
          
          </form>
        </div>
    )
 }
 
 export default Login;