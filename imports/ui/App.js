import React, { Component } from 'react'; 
import { withTracker } from 'meteor/react-meteor-data';
import { Posts } from '../api/posts.js';
import Post from './Post.js';
import ReactDOM from 'react-dom';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Meteor } from 'meteor/meteor';
import ReactPaginate from 'react-paginate';
 
// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
      offset: 0,
      perPage: 5,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('posts.insert', text);
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderPosts() {
    let currentPosts = this.props.posts;
    if(this.state.offset)
      currentPosts = this.state.posts;
    return currentPosts.map((post) => (
      <Post key={post._id} post={post} />
    ));
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    let offset = selected * this.state.perPage;
    this.setState({ offset: offset, posts: Posts.find({}, { sort: { createdAt: -1 }, skip: offset, limit: this.state.perPage  }).fetch() });
    this.renderPosts();
  };

  render() {
    return (
      <div className="container">
        <header>

           <h1>Posts({this.props.postsCount})</h1>
          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-post" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new posts"
              />
            </form> : ''
          }

        </header>
        { this.props.postsCount ?
          <div className="container">
            <ul>
              {this.renderPosts()}
            </ul>
              { this.props.postsCount > this.state.perPage ?
              <ReactPaginate previousLabel={"previous"}
                nextLabel={"next"}
                breakClassName={"break-me"}
                pageCount={this.props.postsCount/this.state.perPage}
                marginPagesDisplayed={1}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} /> : ''
              }
            </div> : 'Sorry! No posts available.'
        }
      </div>
    );
  }

}

export default withTracker(() => {
    return {
  
      posts: Posts.find({}, { sort: { createdAt: -1 }, limit:5 }).fetch(),
      postsCount: Posts.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    };
  })(App);