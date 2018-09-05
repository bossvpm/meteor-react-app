import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

// Comment component - represents a single comment item
export default class Comment extends Component {

  deleteThisComment() {
    Meteor.call('comments.remove', this.props.comment._id);
  }

  render() {
    return (
      <li>
        <button className="button remove" onClick={this.deleteThisComment.bind(this)}>
          Remove
        </button>
        <span className="text">
          <span className="username">{this.props.comment.username}</span>: {this.props.comment.text}
        </span>
      </li>
    );
  }

}