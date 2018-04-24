import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";
import MovieList from "./components/movie-list";
import MovieCreate from './components/movie-create';
import MovieDetails from './components/movie-details';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import './style/style.css';
const client = new ApolloClient ({
  // To optimize caching...
  dataIdFromObject: object => object.id
});

const Root = () => {
  return (
  <ApolloProvider client={client}>
  <Router history={hashHistory}>
    <Route path='/'>
      <IndexRedirect to='/movies'/>
      <Route path='/movies' component={MovieList}/>
      <Route path='/movies/new' component={MovieCreate}/>
      <Route path='/movie/:id' component={MovieDetails}/>
    </Route>
  </Router>
  </ApolloProvider>
  )
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
