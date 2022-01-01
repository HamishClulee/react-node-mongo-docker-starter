import * as __SNOWPACK_ENV__ from './_snowpack/env.js';

import React, {useState, useEffect} from "./_snowpack/pkg/react.js";
import {ApolloClient, InMemoryCache, ApolloProvider, gql} from "./_snowpack/pkg/@apollo/client.js";
const client = new ApolloClient({
  uri: __SNOWPACK_ENV__.NODE_ENV === "production" ? `https://do-it-daily.xyz/graphql` : "http://localhost:7000/graphql",
  cache: new InMemoryCache()
});
const getBooks = client.query({
  query: gql`
    query Books {
      books {
        author
        title
      }
    }
  `
});
const App = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    (async () => {
      await getBooks.then((result) => setBooks(result.data.books));
    })();
  }, []);
  return /* @__PURE__ */ React.createElement(ApolloProvider, {
    client
  }, /* @__PURE__ */ React.createElement("div", {
    className: "App"
  }, /* @__PURE__ */ React.createElement("header", {
    className: "App-header"
  }, /* @__PURE__ */ React.createElement("div", null, "Books:", " ", books.map(({author, title}, index) => /* @__PURE__ */ React.createElement("div", {
    key: index
  }, `title: ${title} - author: ${author}`))))));
};
export default App;
