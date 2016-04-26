/**
 * Created by kepoly on 4/20/2016.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//create a new mongo collection to hold the blog comments
export const Comments = new Mongo.Collection('comments');

if(Meteor.isServer) {
    Meteor.publish('comments', function commentsPublication() {
        return Comments.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'comments.insert'(body, isPrivate, id) {
        check(body, String);
        check(isPrivate, Boolean);
        check(id, String);

        if(! Meteor.userId()) {
            throw new Meteor.Error('insert-access-not-authorized');
        }

        Comments.insert({
            body,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            private: isPrivate,
            editing: false,
            postId: id
        });
    },
    //delete from the collection where the id equals the incoming commentId parameter
    'comments.remove'(commentId) {

    check(commentId, String);

    const comment = Comments.findOne(commentId);

    if(comment.private && comment.owner !== Meteor.userId()) {
        throw new Meteor.Error('delete-access-not-authorized');
    }
    Comments.remove(commentId);
},
//enable editing on the front end using editing field in the collection
'comments.edit'(commentId, editingNow) {
    check(commentId, String);
    check(editingNow, Boolean);

    const comment = Comments.findOne(commentId);

    if(comment.owner !== Meteor.userId()) {
        throw new Meteor.Error('set-private-access-not-authorized');
    }
    Comments.update(commentId, { $set: { editing: editingNow }});
},
//after editing is enabled you may update the data in the collection
'comments.update'(commentId,  body) {
    check(commentId, String);
    check(body, String);

    const comment = Comments.findOne(commentId);

    if(comment.owner !== Meteor.userId()) {
        throw new Meteor.Error('set-private-access-not-authorized');
    }
    Comments.update(commentId, { $set: { body: body, editing: false }});
},
//set a comment to private so only you may view it
'comments.setPrivate'(commentId, setToPrivate) {
    "use strict";
    check(commentId, String);
    check(setToPrivate, Boolean);

    const comment = Comments.findOne(commentId);

    if(comment.owner !== Meteor.userId()) {
        throw new Meteor.Error('set-private-access-not-authorized');
    }
    Comments.update(commentId, { $set: { private: setToPrivate } });
},

});