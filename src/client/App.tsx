import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

type Book = {
  author: string;
  title: string;
};

const client = new ApolloClient({
  // @ts-ignore
  uri: import.meta.env.NODE_ENV === 'production' ? `https://do-it-daily.xyz/graphql` : 'http://localhost:7000/graphql',
  cache: new InMemoryCache(),
});

const getBooks = client.query({
  query: gql`
    query Books {
      books {
        author
        title
      }
    }
  `,
});

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    (async () => {
      await getBooks.then((result) => setBooks(result.data.books));
    })();
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <div>
            All The Books:{' '}
            {books.map(({ author, title }, index) => (
              <div key={index}>{`title: ${title} - author: ${author}`}</div>
            ))}
          </div>
        </header>
      </div>
    </ApolloProvider>
  );
};

export default App;
