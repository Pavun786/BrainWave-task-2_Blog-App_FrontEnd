import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import { useNavigate,Link} from "react-router-dom";  
import * as yup from "yup";
import { API } from './Global';


  const RegisterValidationSchema = yup.object({
    userName:yup.string().required(),
    email:yup.string().required(),
    password:yup.string().required(),
  });
 
  function Register(){
    
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            userName:"",
            email:"",
            password:"",
           
        },
   
        validationSchema:RegisterValidationSchema,

       onSubmit:async (values)=>{
       
       
         try{

            const signup = await fetch(`${API}/user/register`,{
                method:"POST",
                body:JSON.stringify(values),
                headers:{"Content-type": "application/json"},
          
               })
              
            const result=await signup.json() 
    
            if(signup.status == 200){

            alert(result.message)
            navigate("/")
          }
          else{
            alert(result.message)
          }

         }catch(err){
            alert(err.message)
         }
           
       }
    });
     
    return(
        <div >
            
        <form className='register-container'onSubmit={formik.handleSubmit}>
        <h3 className='register'>Register</h3>
          <TextField id="outlined-basic" 
            label="userName" 
            variant="outlined" 
            value={formik.values.userName}
            onChange={formik.handleChange}
            name="userName"
            onBlur={formik.handleBlur} 
            error={formik.touched.userName && formik.errors.userName}
            helperText={formik.touched.userName && formik.errors.userName ? formik.errors.userName : null}/>

          <TextField id="outlined-basic" 
            label="email" 
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            name="email" 
            onBlur={formik.handleBlur} 
            error={formik.touched.email && formik.errors.email}
            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}/>

          <TextField id="outlined-basic" 
            label="password" 
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            name="password" 
            onBlur={formik.handleBlur} 
            error={formik.touched.password && formik.errors.password}
            helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}/>

          <Button type="submit" variant="outlined">submit</Button>
          
          <p> If you have an account <Link to="/" className='link'>Click-Here</Link> </p>
     
          </form>
        </div>
    )
 }
 
 export default Register;