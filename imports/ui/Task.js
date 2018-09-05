import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';

import ReactDOM from 'react-dom';
import { Comments } from '../api/comments.js';
import { withTracker } from 'meteor/react-meteor-data';
import  Comment  from './Comment.js'

// Task component - represents a single todo item
class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }
  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    
    let data = {};
    data.text = text;
    data.post = this.props.task._id;
    Meteor.call('comments.insert', data);
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  renderComments() {
    return this.props.comments.map((comment) => (
      <Comment key={comment._id} comment={comment} />
    ));
  }
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? 'checked' : '';
    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
        <input
          type="checkbox"
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
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
    comments: Comments.find({post: props.task._id}, { sort: { createdAt: -1 } }).fetch(),
  };
})(Task);