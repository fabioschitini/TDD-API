import React from 'react';
import { render, screen,fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UpdateGames from './UpdateGames'
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {Route,BrowserRouter as Router,MemoryRouter} from 'react-router-dom'

const allGames = [
    { id: '1', title: 'Elden Ring' }, 
    { id: '2', title: 'Dark Souls' }, 
    { id: '3', title: 'Blodborne' }
  ];

  const users=[
    {id:'1',username:'user1',password:'senha'},
    {id:'2',username:'user2',password:'senha'},
    {id:'3',username:'user3',password:'senha'}
  
  ]


const server = setupServer(
    rest.put('/games', (req, res, ctx) => {
      try{
        console.log(req.body.id,'bodyyyyyyyyyyyyyyy')
        let updatedGame={
          id:req.body.id,
          title:req.body.title
      }
     let result= allGames.map(game=>{
          if(game.id===req.body.id){
              return updatedGame
          }
          return game
      })
    return res(ctx.json({ games:  result }));
      }
      catch(e){
        console.error(e.message)
      }
 
    }),
    rest.get('/games', (req, res, ctx) => {
      return res(ctx.json({allGames }));
   }),
   rest.get('/login', (req, res, ctx) => {
    return res(ctx.json({ users }));
  })
  );

  beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


 test('Render the input field and button,also the title input should have the value of the especifi game',async()=>{
        render(
          <MemoryRouter initialEntries={["/games/1"]}>
      <UpdateGames />
    </MemoryRouter>
        )
      expect(await screen.findByDisplayValue("Elden Ring")).toBeInTheDocument()
      expect( screen.getByText(/submit/i)).toBeInTheDocument();
  }) 

   test('full app rendering/navigating', async () => {
    render(
      <MemoryRouter initialEntries={["/games/1"]}>
      <UpdateGames />
    </MemoryRouter>
      )
     expect(screen.getByTestId('location-display')).toHaveTextContent('/games/1')
   fireEvent.click(screen.getByText(/eucaceta/i))
     expect(screen.getByTestId('location-display')).toHaveTextContent('/idk')
  }) 


  test('Dont load if not logged in', async () => {
    server.use(
      rest.get('/login', (req, res, ctx) => { 
        return res(ctx.status(401),ctx.json('Not logged in'));
      })
    ); 
    render(
      <MemoryRouter initialEntries={["/games/1"]}>
      <UpdateGames />
    </MemoryRouter>
      )
     expect(screen.getByText('You do not have permission to acesse this page')).toBeInTheDocument()
   
  }) 


  test('Update the game and return the new array with updated array',async()=>{
    render(
      <MemoryRouter initialEntries={["/games/1"]}>
      <UpdateGames />
    </MemoryRouter>
    )
 //const yolo= await screen.findByLabelText("Title")
    const nameField=await  screen.findByLabelText('Title')
    const button= await screen.findByText(/submit/i)
    fireEvent.change(nameField,{target:{value:'Sekiro'}})
    fireEvent.click(button);
    await waitFor(() =>{expect( screen.getByTestId('test')).toHaveTextContent('{"id":"1","title":"Sekiro"}')})
  })
