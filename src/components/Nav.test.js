import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Nav from './Nav'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const users=[
    {id:1,username:'user1',password:'senha'},
    {id:2,username:'user2',password:'senha'},
    {id:3,username:'user3',password:'senha'}
  
  ]

  const server = setupServer(
    rest.get('/login', (req, res, ctx) => {
      return res(ctx.json({ users }));
    })
  );
  
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

test('Render the list ',()=>{
    render(<Nav />)
    expect(screen.getByText('Login'))
    expect(screen.getByText('List'))
    expect(screen.getByText('Add'))

    //expect(screen.getByRole('button').toHaveTextContent("Submit"));
})

test('Show link to pages accesible only when logged in',async()=>{
    render(<Nav />);
    expect(await screen.findByText("Logout")).toBeInTheDocument()
    expect(await screen.findByText("Account")).toBeInTheDocument()

})