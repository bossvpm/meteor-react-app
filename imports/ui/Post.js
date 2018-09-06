import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import ReactDOM from "react-dom";
import { Comments } from "../api/comments.js";
import { withTracker } from "meteor/react-meteor-data";
import Comment from "./Comment.js";

// Post component - represents a single post item
class Post extends Component {
  constructor() {
    super();
    if (this.state == null) {
      this.state = {
        editPost: 0
      };
    }
  }

  editThisPost() {
    if (this.props.post.owner === this.props.currentUser._id) {
      this.setState({ editPost: this.props.post._id });
    }
  }

  handleEditPost(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    if (text) {
      let data = { post: this.props.post._id, text: text };
      Meteor.call("posts.update", this.props.post._id, text);
      this.setState({ editPost: 0 });
    }
  }

  deleteThisPost() {
    if (this.props.post.owner === this.props.currentUser._id) {
      Meteor.call("posts.remove", this.props.post._id);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    if (text) {
      let data = {};
      data.text = text;
      data.post = this.props.post._id;
      Meteor.call("comments.insert", data);
      ReactDOM.findDOMNode(this.refs.textInput).value = "";
    }
  }

  renderComments() {
    return this.props.comments.map(comment => (
      <Comment key={comment._id} comment={comment} />
    ));
  }

  render() {
    return (
      <li className="post" id={this.props.post._id}>
        {this.props.currentUser != null &&
        this.props.post.owner === this.props.currentUser._id ? (
          <div>
            <button
              className="button remove"
              onClick={this.deleteThisPost.bind(this)}
            >
              Remove
            </button>
            <button
              className="button edit"
              onClick={this.editThisPost.bind(this)}
            >
              Edit
            </button>
          </div>
        ) : (
          ""
        )}
        <span className="text">
          <strong>{this.props.post.username}</strong>:
          {this.state.editPost == this.props.post._id ? (
            <form
              className="new-post"
              onSubmit={this.handleEditPost.bind(this)}
            >
              <input
                type="text"
                ref="textInput"
                defaultValue={this.props.post.text}
              />
            </form>
          ) : (
            ""
          )}
          {!this.state.editPost ? this.props.post.text : ""}
        </span>
        {this.props.currentUser != null ? (
          <form className="new-comment" onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new comments"
            />
          </form>
        ) : (
          ""
        )}
        <ul className="comment">{this.renderComments()}</ul>
      </li>
    );
  }
}

export default withTracker(props => {
  return {
    comments: Comments.find(
      { post: props.post._id },
      { sort: { createdAt: -1 } }
    ).fetch(),
    currentUser: Meteor.user()
  };
})(Post);
