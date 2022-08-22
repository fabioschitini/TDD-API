import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import Login from './LogIn'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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
    })
  );

  beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the input for username and password', () => {
    render(<Login  />);

    expect(screen.getByRole('button')).toHaveTextContent('Submit');
    expect(screen.getByPlaceholderText('username'))
    .toBeInTheDocument();
    expect(screen.getByPlaceholderText('password'))
    .toBeInTheDocument();
    expect(screen.queryByText("Logged in Suceffuly!")).not.toBeInTheDocument()

  });

  test('Submit the values using the button,render the tou are logge ind and receive user array from API',async ()=>{
    render(<Login />)
    const userNameField=screen.getByPlaceholderText('username')
    const passwordField=screen.getByPlaceholderText('password')

    const button=screen.getByRole('button')

    fireEvent.change(userNameField,{target:{value:'user1'}})
    fireEvent.change(passwordField,{target:{value:'senha'}})
    fireEvent.click(button);

    expect(await screen.findByText("Logged in Suceffuly!")).toBeInTheDocument()
  
    //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})

test('Submit the wrong value for username and recevie apropiate response',async ()=>{
  render(<Login />)
  const userNameField=screen.getByPlaceholderText('username')
  const passwordField=screen.getByPlaceholderText('password')

  const button=screen.getByRole('button')

  fireEvent.change(userNameField,{target:{value:'us'}})
  fireEvent.change(passwordField,{target:{value:'senha'}})
  fireEvent.click(button);

  expect(await screen.findByText("Username doesnt exist!")).toBeInTheDocument()

  //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})

test('Submit the wrong value for username and recevie apropiate response',async ()=>{
  render(<Login />)
  const userNameField=screen.getByPlaceholderText('username')
  const passwordField=screen.getByPlaceholderText('password')

  const button=screen.getByRole('button')

  fireEvent.change(userNameField,{target:{value:'user1'}})
  fireEvent.change(passwordField,{target:{value:'sen'}})
  fireEvent.click(button);

  expect(await screen.findByText("Password doesnt match!")).toBeInTheDocument()

  //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})

test('Server side error',async ()=>{
  server.use(
    rest.post('/login', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ errorMessage: 'Internal server error!' }),
      );
    })
  );
  render(<Login />)
  const userNameField=screen.getByPlaceholderText('username')
  const passwordField=screen.getByPlaceholderText('password')

  const button=screen.getByRole('button')

  fireEvent.change(userNameField,{target:{value:'user1'}})
  fireEvent.change(passwordField,{target:{value:'senha'}})
  fireEvent.click(button);

  expect(await screen.findByText("Internal server error!")).toBeInTheDocument()

  //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})