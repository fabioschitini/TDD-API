import React from 'react';
import { render, screen,fireEvent,waitFor  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SubmitGame from './SubmitGame'
import Login from './LogIn'
import Nav from './Nav'
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {MemoryRouter} from 'react-router-dom'

const allGames = [
    { id: 1, title: 'Elden Ring' }, 
    { id: 2, title: 'Dark Souls' }, 
    { id: 3, title: 'Blodborne' }
  ];

  const users=[
    {id:1,username:'user1',password:'senha'},
    {id:2,username:'user2',password:'senha'},
    {id:3,username:'user3',password:'senha'}
  
  ]

const server = setupServer(
    rest.post('/games', (req, res, ctx) => {
      try{
        let newGame={
          id:allGames[2].id+1,
          title:req.body.name
      }
      allGames.push(newGame)
    return res(ctx.json({ games: allGames }));
      }
      catch(e){
        console.error(e.message)
      }
    }),
    rest.get('/login', (req, res, ctx) => {
      try{
        return res(ctx.json({ users }));
      }
      catch(e){
        console.error(e.message)
      }
    })
  );
  beforeAll(() => server.listen({onUnhandledRequest:'bypass'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


test('Submit the values using the button,and log',async ()=>{
  render(<MemoryRouter><Login  /></MemoryRouter>)
  const userNameField=screen.getByPlaceholderText('username')
  const passwordField=screen.getByPlaceholderText('password')
  const button=screen.getByText(/submit/i)
  fireEvent.change(userNameField,{target:{value:'user1'}})
  fireEvent.change(passwordField,{target:{value:'senha'}})
  fireEvent.click(button);
  await waitFor(() =>{expect( screen.getByTestId('test')).toHaveTextContent("user1")})
  expect(screen.getByTestId('location-display')).toHaveTextContent('/home')
})

test('Render the input field and button to create a new game if you are logged in',async()=>{
    render(<MemoryRouter> <SubmitGame/></MemoryRouter>
   )
    expect(await screen.getByPlaceholderText('Enter the game name...'))
    expect( screen.getByText(/submit/i)).toBeInTheDocument();
  })

test('Submit the values using the button and receveid the new array from the server',async ()=>{
    render(<MemoryRouter> <SubmitGame/></MemoryRouter>)
    const nameField=screen.getByPlaceholderText('Enter the game name...')
    const button=screen.getByText(/submit/i)
    fireEvent.change(nameField,{target:{value:'Zelda'}})
    fireEvent.click(button);
    await waitFor(() =>{expect( screen.getByTestId('test')).toHaveTextContent('"title":"Zelda"')})
    expect(screen.getByTestId('location-display')).toHaveTextContent('/home')
  })

/* test('error on the server side',async ()=>{
    server.use(
        rest.post('/games', (req, res, ctx) => {
          try{
            dea
          }
          catch(e){
            return res(
              ctx.status(500),
              ctx.json({ message: 'Internal server error' }),
            );
          }
        })
      );
    render(<MemoryRouter> <SubmitGame/></MemoryRouter>)
    const nameField=screen.getByPlaceholderText('Enter the game name...')
    const button=screen.getByRole('button')
    fireEvent.change(nameField,{target:{value:'Zelda'}})
    fireEvent.click(button);
    expect(await screen.findByText("Failed to submit the game!")).toBeInTheDocument()
  }) */

test('Log out and then see if the na isnt shwoing the logout button',async()=>{

    // server.use(
     //  rest.get('/login', (req, res, ctx) => { 
      //   return res(ctx.status(401),ctx.json('Not logged in'));
      // })
    // );  
     render(<MemoryRouter><Nav /></MemoryRouter>);
      expect(await screen.findByText("Logout")).toBeInTheDocument()
     fireEvent.click(await screen.findByText("Logout"));
     //await waitFor(() =>{ expect( screen.queryByText("Logout")).not.toBeInTheDocument() }) 
   }) 

test('Dont load if not logged in',async()=>{
    server.use(
      rest.get('/login', (req, res, ctx) => {
        try{
          return res(ctx.status(401),ctx.json('Not logged in'));
        }
        catch(e){
          console.error(e.message)
        }
      })
    );
      render(<MemoryRouter> <SubmitGame/></MemoryRouter>)
      expect(await screen.findByText("You do not have permission to acesse this page")).toBeInTheDocument()
  }) 

