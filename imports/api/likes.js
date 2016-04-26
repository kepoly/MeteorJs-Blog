/**
 * Created by kepoly on 4/20/2016.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//create a new mongo collection to hold the blog likes
export const Likes = new Mongo.Collection('likes');

if(Meteor.isServer) {
    Meteor.publish('likes', function likesPublication() {
        return Likes.find({
        });
    });
}

Meteor.methods({
    'likes.insert'(liked, type, id) {
        check(liked, Boolean);
        check(type, String);
        check(id, String);

        if(! Meteor.userId()) {
            throw new Meteor.Error('insert-access-not-authorized');
        }
        Likes.insert({
            liked: liked,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            type: type,
            typeid: id
        });
    },
    'likes.updateAfterLiked'(liked, id) {
        check(liked, Boolean);
        check(id, String);

        if(! Meteor.userId()) {
            throw new Meteor.Error('insert-access-not-authorized');
        }

        Likes.update({"typeid": id, "owner": Meteor.userId()}, { $set: { liked: liked }});

    }
});
