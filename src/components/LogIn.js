import { useState } from "react";
import axio from 'axios'
import { LocationDisplay } from '../App';
import {useNavigate} from 'react-router-dom'

const Login=()=>{
    const [username,setUsername]=useState()
    const [password,setPassword]=useState()
    const [submitMessage,setSubmitMessage]=useState()
    const [errorMessage,setErrorMessage]=useState()
    const [usersList,setUsersList]=useState('yolo')
    const navigate=useNavigate()
const submit=async ()=>{
    try{
        const response=await axio.post('/login',{username,password})
      setUsersList(JSON.stringify(response.data.users))
      navigate('/home')
     }
    catch(e){
        console.log(e.response.data)
        setErrorMessage(e.response.data.errorMessage)
        console.error(e.message)
    }
}
    return(
        <div>
            <h1>Login Page</h1>
<input onChange={(e)=>setUsername(e.target.value)} placeholder="username"/>
<input onChange={(e)=>setPassword(e.target.value)} placeholder="password"/>
<button onClick={submit}>Submit</button>
<p>{submitMessage}</p>
<p>{errorMessage}</p>
<div  style={{display:'none'}} data-testid="test">{usersList}</div>
<LocationDisplay/>
        </div>
    )
}

export default Login