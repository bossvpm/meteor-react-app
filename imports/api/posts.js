import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');
Meteor.methods({
    'posts.insert'(text) { 
      check(text, String);
      // Make sure the user is logged in before inserting a post
      if (! this.userId) {
        throw new Meteor.Error('not-authorized'); 
      }   
      Posts.insert({ 
        text, 
        createdAt: new Date(), 
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
    'posts.remove'(postId) {
      check(postId, String);
      Posts.remove(postId);
    },
    'posts.update'(postId, text) {
      check(postId, String);
      Posts.upsert(
        {_id: postId},
        {
          text: text,
          createdAt: new Date(), 
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username,
        }
      );
    },
  });