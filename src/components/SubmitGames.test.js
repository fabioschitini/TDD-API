import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SubmitGame from './SubmitGame'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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
        let newGame={
            id:allGames[2].id+1,
            title:req.body.name
        }
        allGames.push(newGame)
      return res(ctx.json({ games: allGames }));
    })
  );

  beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


test('Render the input field and button to create a new game if you are logged in',async()=>{
  server.use(
    rest.get('/login', (req, res, ctx) => {
      return res(ctx.json({ users }));
    })
  );
    render(<SubmitGame/>)
    expect(await screen.getByPlaceholderText('Enter the game name...'))
    expect(await screen.getByRole('button')).toHaveTextContent('Submit');

    //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})


test('Dont load if not logged in',async()=>{
  server.use(
    rest.get('/login', (req, res, ctx) => {
      return res(ctx.status(401),ctx.json('Not logged in'));
    })
  );
    render(<SubmitGame/>)
    expect(await screen.findByText("You do not have permission to acesse this page")).toBeInTheDocument()

    //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})



test('Submit the values using the button and receveid the new array from the server',async ()=>{
    render(<SubmitGame />)
    const nameField=screen.getByPlaceholderText('Enter the game name...')
    const button=screen.getByRole('button')

    fireEvent.change(nameField,{target:{value:'Zelda'}})
    fireEvent.click(button);

    expect(await screen.findByText("Succesufully submited!")).toBeInTheDocument()
  
    //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})

test('error on the server side',async ()=>{
    
    server.use(
        rest.post('/games', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ message: 'Internal server error' }),
          );
        })
      );
    render(<SubmitGame />)
    const nameField=screen.getByPlaceholderText('Enter the game name...')
    const button=screen.getByRole('button')

    fireEvent.change(nameField,{target:{value:'Zelda'}})
    fireEvent.click(button);

    expect(await screen.findByText("Failed to submit the game!")).toBeInTheDocument()
  
    //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})


