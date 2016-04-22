/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Posts } from '../../api/posts.js';

import './user.html';

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

Template.user.onCreated(function userOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('posts');
});

Template.user.helpers({
    userdata() {
        return Template.instance().data;
    },
    userposts() {
        return Posts.find({ username: { $in: [Template.instance().data] } });
    }

});

Template.user.events({

});