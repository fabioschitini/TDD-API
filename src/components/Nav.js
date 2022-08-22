import { useState,useEffect } from "react";
import axio from 'axios'

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
    <li>Login</li>
    <li>List</li>
    <li>Add</li>
    {users&& <li >Logout</li>}
    {users&& <li >Account</li>}

</ul>

        </div>
    )

}
 


export default Nav