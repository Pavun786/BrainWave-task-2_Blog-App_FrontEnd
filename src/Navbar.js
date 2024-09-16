import {useState } from "react";
import "./App.css"
import MenuIcon from '@mui/icons-material/Menu';
import {Link, useNavigate} from "react-router-dom"


function Navbar ({children}){

  const [show,setShow] = useState(true)
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  const navigate = useNavigate()

  
  const handleChage = () =>{
      setShow(!show)
      console.log("clicked")
  }

  const logoutFunction=()=>{
    localStorage.clear("token")
    navigate("/")
  }



    return(
        <nav>
         <div className="logo">
          BLOG_APP
         </div>
        <ul className={show ? "showMenu" : ""}>
            
           
            <li><Link to="/create-blog">Add-Blog</Link></li>
            <li><Link to="/blogs">GetAll-Blogs</Link></li>
            <li><Link to="/my-blogs">My-blogs</Link></li>
            <div className="logout" >
            <li>{user}</li>
            <li onClick={logoutFunction}>{token ? "Logout" : "Login"}</li>
            </div>
         </ul> 

         <div className="amber" onClick={()=>handleChage()}>
            <MenuIcon/>
         </div>
        </nav>
    )
}
export default Navbar;