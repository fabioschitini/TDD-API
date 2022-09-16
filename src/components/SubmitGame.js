import { useState,useEffect } from "react";
import axio from 'axios'
import { LocationDisplay } from '../App';
import {Link,useNavigate} from 'react-router-dom'
const instance = axio.create({
    baseURL: 'https://radiant-garden-44368.herokuapp.com/',
    withCredentials:true
  }); 
const SubmitGames=()=>{
    const [name,setName]=useState()
    const [submitMessage,setSubmitMessage]=useState()
    const [errorMessage,setErrorMessage]=useState()
    const [users,setUsers]=useState(false)
    const [games,setGames]=useState('yolo')

    const navigate=useNavigate()
    useEffect(()=>{
        const fetchUsers=async ()=>{
           try{
            console.log('fecthin usersssssssssssss')
               const response=await instance.get('/login')
               setUsers(true)
               console.log('loginnnnnnnnnnn')
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
    const response=await instance.post('/games',{title:name})
    setSubmitMessage('Succesufully submited!')
    setGames(JSON.stringify(response.data))
    navigate('/home')
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
        <div  style={{display:'none'}} data-testid="test">{games}</div>
        <LocationDisplay/>
    </div>
)
}

export default SubmitGames