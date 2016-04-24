/**
 * Created by kepoly on 4/20/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Posts } from '../../api/posts.js';
import { Comments } from '../../api/comments.js';

import './singlepost.html';

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
})

Template.singlepost.onCreated(function singlepostOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('posts');
    Meteor.subscribe('comments');
});

findId = function() {
    var title = Template.instance().data.postTitle;
    var user = Template.instance().data.userName;
    var data = Posts.findOne({title: title, username: user});
    return data;
}

Template.comment.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
});

Template.comment.events({
    'click .delete'() {
        Meteor.call('comments.remove', this._id); //delete from collection where id is the post clicked on
    },
    'click .toggle-edit'() {
        "use strict";
        Meteor.call('comments.edit', this._id, !this.editing); //toggle edit for the id of the post clicked on
    },
    'submit .update-comment'(event) {
        event.preventDefault();

        //submits a new update to the collection for the edited post using it's id.
        const target = event.target;
        const body = target.body.value;

        Meteor.call('comments.update', this._id, body);

        target.body.value = '';
    },
    'click .toggle-private'() {
        "use strict";
        Meteor.call('comments.setPrivate', this._id, !this.private);
    },
});

Template.singlepost.helpers({
    isOwner() {
        console.log(this.owner === Meteor.userId());
        return this.owner === Meteor.userId();
    },
    singlepostid() {
        var title = Template.instance().data.postTitle;
        var user = Template.instance().data.userName;
        var data = Posts.findOne({title: title, username: user});
        return data;
    },
    postdata() {
        return Template.instance().data;
    },
    posts() {
        return Posts.find({ title: Template.instance().data.postTitle, username: Template.instance().data.userName}, { sort: { createdAt: -1 }  });
    },
    comments() {
        var postTitle = Template.instance().data.postTitle;
        var user = Template.instance().data.userName;
        //i really dont think this is the meteor way of doing things but it works.
        var data = findId();
        if(typeof data != 'undefined') {
            var ret = Comments.find({ postId: data._id }, { sort: { createdAt: -1 }  });
            return ret;
        }
    }
});

Template.singlepost.events({
    'submit .new-comment-post'(event) {
        event.preventDefault();

        //retrieve the values from form event.
        const target = event.target;
        const body = target.body.value;
        const postId = target.postId.value;

        const isPrivate = target.isPrivate.checked;
        //call the method insert with title and body as params.
        Meteor.call('comments.insert', body, isPrivate, postId);
        //reset the fields after insert.
        target.title.value = '';
        target.body.value = '';
    },
});