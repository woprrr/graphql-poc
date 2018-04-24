import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import CreateReviewMutation from '../queries/createReview';
import readMovieQuery from "../queries/readMovie";

class ReviewCreate extends Component {
    constructor(props){
        super(props);
        this.state ={ terms: ""};
    }
    render() {
        return (
            <div>
                <div className="row">
                    <form className="input-field col s6">
                        <input type='text'
                        className='validate'
                        onChange={e => this.setState({terms: e.target.value})}
                        value={this.state.terms}
                        onKeyPress={this.handleSubmitForm.bind(this)}
                        />
                        <label className='active'>Ajouter une review</label>
                    </form>
                </div>
            </div>
        );
    }

    handleSubmitForm(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.props.CreateReviewMutation({
                variables:{
                    content: this.state.terms,
                    movieId: this.props.movieId
                }
            }).then( () => {
                this.setState({terms: ''});
            });
        }
    }
}

export default compose(
    graphql(CreateReviewMutation, {
        name: 'CreateReviewMutation'
    }),
)(ReviewCreate);