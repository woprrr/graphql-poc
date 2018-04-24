import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router';
import readMovieQuery from '../queries/readMovies';
import DeleteMoviesMutation from '../queries/deleteMovies';

class MovieList extends Component {
    render () {
        return (
            <div>
                <h1>Liste des films</h1>
                <ul className="collection">
                    {this.renderMovies()}
                </ul>
                <Link to='/movies/new' className='btn-floating btn-large waves-effect blue right'>
                    <i className='material-icons'>add</i>
                </Link>
            </div>
        )
    }

    renderMovies () {
        if (this.props.readMovieQuery.loading) {
            return "Loading ...";
        }

        return this.props.readMovieQuery.movies.map( (movie) => {
        return (<li key={movie.id} className="collection-item">
        <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        <i className="material-icons secondary-content delete_button" onClick= {() => this.onDeleteMovie(movie.id)
            }>delete</i>
        </li>);
        } )
    }

    onDeleteMovie (id) {
        this.props.deleteMoviesMutation({
            variables:{
                id
            }
        }).then( () => {
          this.props.readMovieQuery.refetch();
        })
    }
}

export default compose(
    graphql(readMovieQuery,{
        name: "readMovieQuery"
    }),
    graphql(DeleteMoviesMutation,{
        name: "deleteMoviesMutation"
    })
)(MovieList);