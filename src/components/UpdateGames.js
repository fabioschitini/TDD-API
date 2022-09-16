import { useState,useEffect } from "react";
import axio from 'axios'
import {useLocation ,Link,useNavigate} from 'react-router-dom'
import { LocationDisplay } from '../App';

const instance = axio.create({
    baseURL: 'https://radiant-garden-44368.herokuapp.com/',
    withCredentials:true
  }); 
const UpdateGames=()=>{
    const [submitMessage,setSubmitMessage]=useState()
    const [errorMessage,setErrorMessage]=useState()
    const [title,setTitle]=useState('')
    const [users,setUsers]=useState(false)
    const [games,setGames]=useState('yolo')
    const location=useLocation()
    const filteredId=location.pathname.replace('/games/','');
    const navigate=useNavigate()
    useEffect(()=>{
        const fetchUsers=async ()=>{
            try{
                const response=await axio.get('https://radiant-garden-44368.herokuapp.com/login')
                setUsers(true)

            }
            catch(e){
                setUsers(false)     
                console.error(e.message)
            }
         }
        const fetchGame=async()=>{
            try{
                const response2=await axio.get('https://radiant-garden-44368.herokuapp.com/games')
                let filteredGame=response2.data.filter(game=>game._id===filteredId)[0]
                setGames(JSON.stringify(response2.data))
                setTitle(filteredGame.title)
            }
            catch(e){
                console.error(e.message)
                   }
        }
        fetchUsers()
        fetchGame()
       },[])
const submit=async ()=>{
    try{
       const response=await axio.put(`https://radiant-garden-44368.herokuapp.com/game/${filteredId}`,{title})
        setSubmitMessage('Succesully updated!')
        setGames(JSON.stringify(response.data))
        navigate('/home')
    }
    catch(e){
        console.error(e.message)
        setErrorMessage('Server Error!')
    }
}

const Delete=async()=>{ 
    try{
        console.log(filteredId,'delteeeeeeeeeeeeeeeeeeeeeee1111111')
        const response=await instance.post(`/games/delete/${filteredId}`)
        console.log(response.data,'deleteeeeeeeeeeeeeeee responseeeeeeeeeeeeeeeeee')
        setGames(JSON.stringify(response.data))
        console.log('delteeeeeeeeeeeeeeeeeeeeeee')
        navigate('/home')
     }
     catch(e){
         console.error(e.message)
         setErrorMessage('Server Error!')
     }
    } 

    return(
        <div>
            {users&& <div>
                <label htmlFor='title'>Title</label>
<input id='title' onChange={(e)=>setTitle(e.target.value)} value={title}/>
<button onClick={submit}>Submit</button>
<div  style={{display:'none'}} data-testid="test">{games}</div>
      <button onClick={Delete}>Delete</button>
                 </div>}
      {!users&&<h1>You do not have permission to acesse this page</h1>}  
      {submitMessage}
    
      <LocationDisplay/>
        </div>
    )
}

export default UpdateGames