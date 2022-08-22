import { useState,useEffect } from "react";
import axio from 'axios'
import {useParams,useLocation ,Link} from 'react-router-dom'
import { LocationDisplay } from '../App';


const UpdateGames=()=>{
    const [submitMessage,setSubmitMessage]=useState()
    const [errorMessage,setErrorMessage]=useState()
    const [title,setTitle]=useState('')
    const [users,setUsers]=useState(false)
    const [games,setGames]=useState('yolo')
    const location=useLocation()
    const filteredId=location.pathname.replace('/games/','');
console.log('yoloooooooooooooooooooo')
    useEffect(()=>{
        const fetchUsers=async ()=>{
            try{
                const response=await axio.get('/login')
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
                let filteredGame=response.data.allGames.filter(game=>game.id===filteredId)[0]
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
       const response=await axio.put('games',{title,id:filteredId})
        setSubmitMessage('Succesully updated!')
        console.log(response.data.games,'updated response')
        setGames(JSON.stringify(response.data.games))
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
      <LocationDisplay/>
        </div>
    )
}

export default UpdateGames