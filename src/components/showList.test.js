import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import Show from './showList'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const allGames = [
  { id: 1, title: 'Elden Ring' }, 
  { id: 2, title: 'Dark Souls' }, 
  { id: 3, title: 'Blodborne' }
];

const server = setupServer(
  rest.get('/games', (req, res, ctx) => {
    try{
      return res(ctx.json({ games: allGames }));
    }
    catch(e){
      console.error(e.message)
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the main heading, the search input', () => {
    render(<Show  />);
    expect( screen.getByText(/find game/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the game name...')).toBeInTheDocument();
  });

test('fetches and displays all games', async () => {
    render(<Show />);
    const listItems = await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent('Elden Ring');
    expect(listItems[1]).toHaveTextContent('Dark Souls');
    expect(listItems[2]).toHaveTextContent('Blodborne');
  });

test('succefully filter games while typing', async () => {
    render(<Show />);
    const input = screen.getByPlaceholderText('Enter the game name...');
    fireEvent.change(input, { target: { value: 'elde' } });
    const listItems = await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent('Elden Ring');
  });



