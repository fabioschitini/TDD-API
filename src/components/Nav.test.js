import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Nav from './Nav'
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

test('when you clikc on the link, the url changes accorginly ',()=>{
    render(<MemoryRouter><Nav /></MemoryRouter>)
   const login=screen.getByText('Login')
   const list= screen.getByText('List')
   const add= screen.getByText('Add')
   fireEvent.click(login);
   expect(screen.getByTestId('location-display')).toHaveTextContent('/login')
   fireEvent.click(add);
   expect(screen.getByTestId('location-display')).toHaveTextContent('/submit')
   fireEvent.click(list);
   expect(screen.getByTestId('location-display')).toHaveTextContent('/home')
})

test('Show link to pages accesible only when logged in',async()=>{
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(await screen.findByText("Logout")).toBeInTheDocument()
    expect(await screen.findByText("Account")).toBeInTheDocument()
})

test('Dont show logout if the user is not loggend in',async()=>{
  server.use(
    rest.get('/login', (req, res, ctx) => { 
      return res(ctx.status(401),ctx.json('Not logged in'));
    })
  ); 

  render(<MemoryRouter><Nav /></MemoryRouter>);
  expect(await screen.queryByText("Logout")).not.toBeInTheDocument()
})