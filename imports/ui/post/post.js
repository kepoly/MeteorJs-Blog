/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { Posts } from '../../api/posts.js';

import './post.html';

function timeSince(date) {


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

Template.post.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    }
});

Template.post.events({
    'click .delete'() {
        Meteor.call('posts.remove', this._id); //delete from collection where id is the post clicked on
    },
    'click .toggle-edit'() {
        "use strict";
        Meteor.call('posts.edit', this._id, !this.editing); //toggle edit for the id of the post clicked on
    },
    'submit .update-post'(event) {
        event.preventDefault();

        //submits a new update to the collection for the edited post using it's id.
        const target = event.target;
        const title = target.title.value;
        const body = target.body.value;

        Meteor.call('posts.update', this._id, title, body);

        target.title.value = '';
        target.body.value = '';
    },
    'click .toggle-private'() {
        "use strict";
        Meteor.call('posts.setPrivate', this._id, !this.private);
    },
    'click .hide-others'(event, instance) {
        //get the incoming button value from the click event
        getText = event.target.value;

        //check if access is from the client and set the session value
        if(Meteor.isClient) {
            Session.set("showUser", getText);
        } else {
            console.log('notworking');
        }
    },
});