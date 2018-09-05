import React, { Component } from 'react';
import { Comments } from '../api/comments.js';
import { Meteor } from 'meteor/meteor';

// Comment component - represents a single comment item
export default class Comment extends Component {

  deleteThisComment() {
    Meteor.call('comments.remove', this.props.comment._id);
  }

  render() {
    return (
      <li>
        <button className="delete" onClick={this.deleteThisComment.bind(this)}>
          &times;
        </button>
        <span className="text">
          {this.props.comment.username}: {this.props.comment.text}
        </span>
      </li>
    );
  }
  
}