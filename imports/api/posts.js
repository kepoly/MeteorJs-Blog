/**
 * Created by kepoly on 4/20/2016.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//create a new mongo collection to hold the blog posts
export const Posts = new Mongo.Collection('posts');

if(Meteor.isServer) {
    Meteor.publish('posts', function postsPublication() {
        return Posts.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    //retrieve the incoming data and make a new post to the collection
    'posts.insert'(title, body) {

        check(title, String);
        check(body, String);

        if(! Meteor.userId()) {
             throw new Meteor.Error('insert-access-not-authorized');
        }

        Posts.insert({
            title,
            body,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            private: false,
            editing: false,
        });
    },
    //delete from the collection where the id equals the incoming postId parameter
    'posts.remove'(postId) {

        check(postId, String);

        const post = Posts.findOne(postId);

        if(post.private && post.owner !== Meteor.userId()) {
            throw new Meteor.Error('delete-access-not-authorized')
        }
        Posts.remove(postId);
    },
    //enable editing on the front end using editing field in the collection
    'posts.edit'(postId, editingNow) {
        check(postId, String);
        check(editingNow, Boolean);

        const post = Posts.findOne(postId);

        if(post.owner !== Meteor.userId()) {
            throw new Meteor.Error('set-private-access-not-authorized');
        }
        Posts.update(postId, { $set: { editing: editingNow }});
    },
    //after editing is enabled you may update the data in the collection
    'posts.update'(postId, title, body) {
        check(postId, String);
        check(title, String);
        check(body, String);

        const post = Posts.findOne(postId);

        if(post.owner !== Meteor.userId()) {
            throw new Meteor.Error('set-private-access-not-authorized');
        }
        Posts.update(postId, { $set: { title: title, body: body, editing: false }});
    },
    //set a post to private so only you may view it
    'posts.setPrivate'(postId, setToPrivate) {
        "use strict";
        check(postId, String);
        check(setToPrivate, Boolean);

        const post = Posts.findOne(postId);

        if(post.owner !== Meteor.userId()) {
            throw new Meteor.Error('set-private-access-not-authorized');
        }
        Posts.update(postId, { $set: { private: setToPrivate } });
    },
});