import { useState,useEffect } from "react";
import axio from 'axios'
import { LocationDisplay } from '../App';
import {Link} from 'react-router-dom'
const instance = axio.create({
    baseURL: 'https://radiant-garden-44368.herokuapp.com',
    withCredentials:true
  }); 
const Nav=()=>{
    const [users,setUsers]=useState(false)
    useEffect(()=>{
     const fetchUsers=async ()=>{
        try{
            const response=await instance.get('/login')
            console.log(response.data)
            setUsers(true)
        }
        catch(e){
            console.error(e.message)
            setUsers(false)     
        }
     }
     fetchUsers()
    },[])

    const LogOut=async()=>{
        try{
            console.log('logging out')
            const repsponse2=await instance.post('/logout')
            console.log('nyannnnnnnnnnnnnnnnnnnnnnnn')
            setUsers(false)
        }
        catch(e){
            console.error(e.message)
        }
   
    }

    return(
        <div>
<ul>
  {!users&&<Link to='/login'> <li>Login</li></Link>} 
   <Link to='/home'> <li>List</li></Link>
   <Link to='/submit'> <li >Add</li></Link>
    {users&&   <Link to='/'><li onClick={LogOut} >Logout</li></Link>}
    {users&& <li >Account</li>}

</ul>
<LocationDisplay/>
        </div>
    )

}
 


export default Nav