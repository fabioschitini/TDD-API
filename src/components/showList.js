import { useState,useEffect } from "react";
import axio from 'axios'

 const ShowList=()=>{
  const instance = axio.create({
    baseURL: 'https://radiant-garden-44368.herokuapp.com/',
    withCredentials:true
  }); 
    const [games,setGames]=useState([])
    const [searchGames,setSearchGames]=useState('')

    useEffect(()=>{
     const fetchGames=async ()=>{
       //const reponse=await axio.get('/games')
        const reponse=await instance.get('/games')
        console.log(reponse.data,'responseeeeeeeeeeeee')
        setGames(reponse.data)
     }
     fetchGames()
    },[])
return(
    <div>
        <h1>Find Game</h1>
        <input placeholder="Enter the game name..." onChange={(e)=>setSearchGames(e.target.value)}/>
<ul>
    {games.map(game=>{
        if(game!==undefined){
            if(searchGames===''){
              return game
            }
            else if(game.title.toLowerCase().includes(searchGames.toLowerCase())){
              return game
            }
        }
    }).map(game=>{
      if(!game){
        return
      }
    return(
           game.title&& <li key={game.id}>{game.title}</li>
        )
    })}
</ul>
    </div>
)
 }

 export default ShowList