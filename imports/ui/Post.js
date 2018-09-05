import React, { Component } from 'react';
//import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Comments } from '../api/comments.js';
import { withTracker } from 'meteor/react-meteor-data';
import  Comment  from './Comment.js'

// Post component - represents a single post item
class Post extends Component {

  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }

  handleSubmit(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    let data = {};
    data.text = text;
    data.post = this.props.post._id;
    Meteor.call('comments.insert', data);
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderComments() {
    return this.props.comments.map((comment) => (
      <Comment key={comment._id} comment={comment} />
    ));
  }

  render() {
    return (
      <li>
        <button className="delete" onClick={this.deleteThisPost.bind(this)}>
          &times;
        </button>
        <span className="text">
          <strong>{this.props.post.username}</strong>: {this.props.post.text}
        </span>
        <form className="new-comment" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new comments"
              />
        </form>
        <ul>
          {this.renderComments()}
        </ul>
      </li>
    );
  }

}

export default withTracker( props => {
  return {
    comments: Comments.find({post: props.post._id}, { sort: { createdAt: -1 } }).fetch(),
  };
})(Post);