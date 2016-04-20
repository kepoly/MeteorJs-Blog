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
    'posts.insert'(title, body) {
        "use strict";
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
});