import { useState } from "react";
import axio from 'axios'
const Login=()=>{
    const [username,setUsername]=useState()
    const [password,setPassword]=useState()
    const [submitMessage,setSubmitMessage]=useState()
    const [errorMessage,setErrorMessage]=useState()

const submit=async ()=>{
    try{

        const response=await axio.post('/login',{username,password})
        setSubmitMessage("Logged in Suceffuly!")
    }
    catch(e){
        setErrorMessage(e.response.data.errorMessage)
    console.log('fudeuuu')
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

        </div>
    )
}

export default Login