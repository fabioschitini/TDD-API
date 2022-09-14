import React from 'react';
import { render, screen,fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Nav from './Nav'
import Login from './LogIn'
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {MemoryRouter} from 'react-router-dom'

const users=[
    {id:1,username:'user1',password:'senha'},
    {id:2,username:'user2',password:'senha'},
    {id:3,username:'user3',password:'senha'}
  ]

  const server = setupServer(
    rest.get('/login', (req, res, ctx) => {
      try{
        return res(ctx.json({ users }));
      }
      catch(e){
        console.error(e.message)
      }
      })
      );
  
  beforeAll(() => server.listen());
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

test('when you clikc on the link, the url changes accorginly ',()=>{
    render(<MemoryRouter><Nav /></MemoryRouter>)
   const login=screen.getByText('Login')
   const list= screen.getByText('List')
   const add= screen.getByText('Add')
   fireEvent.click(login);
   expect(screen.getByTestId('location-display')).toHaveTextContent('/login')
   fireEvent.click(add);
   expect(screen.getByTestId('location-display')).toHaveTextContent('/submit')
})

test('Show link to pages accesible only when logged in',async()=>{
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(await screen.findByText("Logout")).toBeInTheDocument()
    expect(await screen.findByText("Account")).toBeInTheDocument()
})

 test('Dont show logout if the user is not loggend in',async()=>{

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