/**
 * Created by kepoly on 4/24/2016.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//create a new mongo collection to hold the blog categories
export const Categories = new Mongo.Collection('categories');

if(Meteor.isServer) {
    Meteor.publish('categories', function categoriesPublication() {
        return Categories.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    //retrieve the incoming data and make a new post to the collection
    'categories.insert'(title, body, isPrivate) {

        check(title, String);
        check(body, String);
        check(isPrivate, Boolean);

        if(! Meteor.userId()) {
            throw new Meteor.Error('insert-access-not-authorized');
        }

        Categories.insert({
            title,
            body,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            private: isPrivate,
            editing: false,
        });
    },
    //delete from the collection where the id equals the incoming categoryId parameter
    'categories.remove'(categoryId) {

        check(categoryId, String);

        const post = Categories.findOne(categoryId);

        if(post.private && post.owner !== Meteor.userId()) {
            throw new Meteor.Error('delete-access-not-authorized');
        }
        Categories.remove(categoryId);
    },
    //enable editing on the front end using editing field in the collection
    'categories.edit'(categoryId, editingNow) {
        check(categoryId, String);
        check(editingNow, Boolean);

        const post = Categories.findOne(categoryId);

        if(post.owner !== Meteor.userId()) {
            throw new Meteor.Error('set-private-access-not-authorized');
        }
        Categories.update(categoryId, { $set: { editing: editingNow }});
    },
    //after editing is enabled you may update the data in the collection
    'categories.update'(categoryId, title, body) {
        check(categoryId, String);
        check(title, String);
        check(body, String);

        const post = Categories.findOne(categoryId);

        if(post.owner !== Meteor.userId()) {
            throw new Meteor.Error('set-private-access-not-authorized');
        }
        Categories.update(categoryId, { $set: { title: title, body: body, editing: false }});
    },
    //set a post to private so only you may view it
    'categories.setPrivate'(categoryId, setToPrivate) {
        "use strict";
        check(categoryId, String);
        check(setToPrivate, Boolean);

        const post = categories.findOne(categoryId);

        if(post.owner !== Meteor.userId()) {
            throw new Meteor.Error('set-private-access-not-authorized');
        }
        Categories.update(categoryId, { $set: { private: setToPrivate } });
    },
});
