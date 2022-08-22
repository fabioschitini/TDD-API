import { useState,useEffect } from "react";
import axio from 'axios'

const SubmitGames=()=>{
    const [name,setName]=useState()
    const [submitMessage,setSubmitMessage]=useState()
    const [errorMessage,setErrorMessage]=useState()
    const [users,setUsers]=useState(true)

    useEffect(()=>{
        const fetchUsers=async ()=>{
           try{
               const response=await axio.get('/login')
               setUsers(true)
               setUsers(response.data)
           }
           catch(e){
               setUsers(false)     
           }
        }
        fetchUsers()
       },[])

       const submit=async()=>{
try{

    const response=await axio.post('/games',{name})
    setSubmitMessage('Succesufully submited!')
}
catch{
    setErrorMessage('Failed to submit the game!')
console.log('fudeuuu')
}


       }

return(
    <div>
        {users&&    <div>
        <input onChange={(e)=>setName(e.target.value)} placeholder="Enter the game name..."/>
        <button onClick={submit}>Submit</button>
       <p>{submitMessage}</p> 
       <p>{errorMessage}</p>
        </div>}
        {!users&&<h1>You do not have permission to acesse this page</h1>}
    
     
    </div>
)
}

export default SubmitGames