import React, { Component } from 'react';
import { Comments } from '../api/comments.js';
import { Meteor } from 'meteor/meteor';

// Task component - represents a single todo item
export default class Comment extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('comments.setChecked', this.props.comment._id, !this.props.comment.checked);
  }

  deleteThisComment() {
    Meteor.call('comments.remove', this.props.comment._id);
  }
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    
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