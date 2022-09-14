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
                const response=await instance.get('/login')
                setUsers(response.data)
            }
            catch(e){
                console.error(e.message)
                setUsers(false)     
            }
         }
        const fetchGame=async()=>{
            try{
                const response=await axio.get('/games')
                const response2=await instance.get('/games')
                let filteredGame=response2.data.filter(game=>game._id===filteredId)[0]
                setGames(response2.data)
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
       const response=await instance.put(`/game/${filteredId}`,{title})
        setSubmitMessage('Succesully updated!')
        console.log(response.data,'updated response')
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
        console.log(filteredId, 'fuckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk youuuuuuuuuuuuuuuu')
        const response=await instance.post(`games/delete/${filteredId}`)
        console.log(response.data,'deleteeeeeeeeeeeeeeee responseeeeeeeeeeeeeeeeee')
        setGames(JSON.stringify(response.data))
        navigate('/home')
     }
     catch(e){
         console.error(e.message)
         setErrorMessage('Server Error!')
     }
    }

    return(
        <div>
         <Link to='/idk'><button>eucaceta</button></Link> 
            {users&& <div>
                <label htmlFor='title'>Title</label>
<input id='title' onChange={(e)=>setTitle(e.target.value)} value={title}/>
<button onClick={submit}>Submit</button>
                 </div>}
      {!users&&<h1>You do not have permission to acesse this page</h1>}  
      {submitMessage}
      <div  style={{display:'none'}} data-testid="test">{games}</div>
      <button onClick={Delete}>Delete</button>
      <LocationDisplay/>
        </div>
    )
}

export default UpdateGames