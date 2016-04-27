/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Posts } from '../../api/posts.js';
import { Comments } from '../../api/comments.js';
import { Likes } from '../../api/likes.js';

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

Template.registerHelper('FormatDate', function(date){
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
});

Template.user.onCreated(function userOnCreated() {
    this.state = new ReactiveDict();
    console.log(this.data);
    Meteor.subscribe('posts');
    Meteor.subscribe('comments');
    Meteor.subscribe('likes');
});

Template.user.helpers({
    userdata() {
        return Template.instance().data;
    },
    userposts() {
        return Posts.find({ username: { $in: [Template.instance().data] } }, { sort: { createdAt: -1 }  });
    },
    extendedData() {
        var returnDetails = {};
        var postCount = Posts.find({username: {$in: [Template.instance().data]}}).count();
        var commentCount = Comments.find({username: {$in: [Template.instance().data]}}).count();
        returnDetails["postCount"] = postCount;
        returnDetails["commentCount"] = commentCount;
        return returnDetails;
    },
    userkarma() {
        var returnDetails = {};

        //TODO
        //Switch this to the users id where typeowner and get the users id by username here instead.
        //TODO
        var username = Template.instance().data;
        var postKarmaUp = Likes.find({"typeowner": username, "type": "post", "liked": true}).count();
        var postKarmaDown = Likes.find({"typeowner": username, "type": "post", "liked": false}).count();
        returnDetails["postKarma"] = postKarmaUp - postKarmaDown;
        var commentKarmaUp = Likes.find({"typeowner": username, "type": "comment", "liked": true}).count();
        var commentKarmaDown = Likes.find({"typeowner": username, "type": "comment", "liked": false}).count();
        returnDetails["commentKarma"] = commentKarmaUp - commentKarmaDown;
        return returnDetails;
    }
});

Template.user.events({

});