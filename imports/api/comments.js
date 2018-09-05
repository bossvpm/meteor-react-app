import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Comments = new Mongo.Collection('comments');
Meteor.methods({
    'comments.insert'(data) { 
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized'); 
      }   
      Comments.insert({ 
        text: data.text,
        post: data.post, 
        createdAt: new Date(), 
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
    'comments.remove'(commentId) {
      check(commentId, String);
      Comments.remove(commentId);
    },
    'comments.setChecked'(commentId, setChecked) {
      check(commentId, String);
      check(setChecked, Boolean);  
      Comments.update(commentId, { $set: { checked: setChecked } }); 
    },
  });