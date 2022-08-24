import { useState,useEffect } from "react";
import axio from 'axios'
import { LocationDisplay } from '../App';
import {Link} from 'react-router-dom'

const Nav=()=>{
    const [users,setUsers]=useState(false)
    useEffect(()=>{
     const fetchUsers=async ()=>{
        try{
            const response=await axio.get('/login')
            setUsers(true)
        }
        catch(e){
            console.error(e.message)
            setUsers(false)     
        }
     }
     fetchUsers()
    },[])

    return(
        <div>
<ul>
  {!users&&<Link to='/login'> <li>Login</li></Link>} 
   <Link to='/home'> <li>List</li></Link>
   <Link to='/submit'> <li >Add</li></Link>
    {users&& <li >Logout</li>}
    {users&& <li >Account</li>}

</ul>
<LocationDisplay/>
        </div>
    )

}
 


export default Nav