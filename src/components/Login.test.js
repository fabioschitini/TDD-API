import React from 'react';
import { render, screen,fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
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
    rest.post('/login', (req, res, ctx) => {
      let userExist=false;
      let passwordMatchs=false;
users.map(user=>{
  if(user.username===req.body.username){
    userExist=true
    if(user.password===req.body.password){
      passwordMatchs=true
    }
  }
})
    if(!userExist)
        return  res(ctx.status(500),ctx.json({ errorMessage: 'Username doesnt exist!' }))
    else if(!passwordMatchs)
      return  res(ctx.status(500),ctx.json({ errorMessage: 'Password doesnt match!' }))
    else
      return res(ctx.json({ users }));
    }),
  );

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the input for username and password', () => {
    render(<MemoryRouter><Login  /></MemoryRouter>);
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('username'))
    .toBeInTheDocument();
    expect(screen.getByPlaceholderText('password'))
    .toBeInTheDocument();
  });

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

test('Submit the wrong value for username and recevie apropiate response',async ()=>{
  render(<MemoryRouter><Login  /></MemoryRouter>)
  const userNameField=screen.getByPlaceholderText('username')
  const passwordField=screen.getByPlaceholderText('password')
  const button=screen.getByText(/submit/i)
  fireEvent.change(userNameField,{target:{value:'us'}})
  fireEvent.change(passwordField,{target:{value:'senha'}})
  fireEvent.click(button);
  expect(await screen.findByText("Username doesnt exist!")).toBeInTheDocument()
})

test('Submit the wrong value for password and recevie apropiate response',async ()=>{
  render(<MemoryRouter><Login  /></MemoryRouter>)
  const userNameField=screen.getByPlaceholderText('username')
  const passwordField=screen.getByPlaceholderText('password')
  const button=screen.getByText(/submit/i)
  fireEvent.change(userNameField,{target:{value:'user1'}})
  fireEvent.change(passwordField,{target:{value:'sen'}})
  fireEvent.click(button);
  expect(await screen.findByText("Password doesnt match!")).toBeInTheDocument()
})

/* test('Server side error',async ()=>{
  server.use(
    rest.post('/login', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ errorMessage: 'Internal server error!' }),
      );
    })
  );
  render(<MemoryRouter><Login  /></MemoryRouter>)
  const userNameField=screen.getByPlaceholderText('username')
  const passwordField=screen.getByPlaceholderText('password')
  const button=screen.getByText(/submit/i)
  fireEvent.change(userNameField,{target:{value:'user1'}})
  fireEvent.change(passwordField,{target:{value:'senha'}})
  fireEvent.click(button);
  expect(await screen.findByText("Internal server error!")).toBeInTheDocument()
})   */