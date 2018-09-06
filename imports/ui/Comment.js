import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Posts } from "../api/posts.js";

// Comment component - represents a single comment item
class Comment extends Component {
  deleteThisComment() {
    if (
      this.props.comment.owner === this.props.currentUser._id ||
      this.props.post.owner === this.props.currentUser._id
    ) {
      Meteor.call("comments.remove", this.props.comment._id);
    }
  }

  render() {
    return (
      <li>
        {this.props.currentUser != null &&
        (this.props.comment.owner === this.props.currentUser._id ||
          this.props.post.owner === this.props.currentUser._id) ? (
          <button
            className="button remove"
            onClick={this.deleteThisComment.bind(this)}
          >
            Remove
          </button>
        ) : (
          ""
        )}
        <span className="text">
          <span className="username">{this.props.comment.username}</span>:{" "}
          {this.props.comment.text}
        </span>
      </li>
    );
  }
}
export default withTracker(props => {
  return {
    currentUser: Meteor.user(),
    post: Posts.findOne({ _id: props.comment.post })
  };
})(Comment);
