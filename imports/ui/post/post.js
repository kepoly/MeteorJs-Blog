/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { Posts } from '../../api/posts.js';
import { Likes } from '../../api/likes.js';

import './post.html';

Template.post.onCreated(function postOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('likes');
});

//return date as ..ago
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
    },
    likeCount() {
        //currently this creates for some odd times when you're testing.
        //like/dislike can be 0 so when you remove one from like to dislike it is like removing two for the first time.
        //eg: 3L 0D = 3-0 = 3: 2L 1D = 2-1 = 0.
        var likeCount = Likes.find({"type": "post", "typeid": this._id, "liked": true}).count();
        var dislikeCount = Likes.find({"type": "post", "typeid": this._id, "liked": false}).count();
        return likeCount - dislikeCount;
    },
    likeUserCheck() {
        var retval = false;
        var retvalBoolean = false;
        var returnDetails = {};

        var isLiked = Likes.find({"type": "post", "typeid": this._id, "owner": Meteor.userId()}).count();
        if(isLiked > 0) {

            var isTrue = Likes.find({"type": "post", "typeid": this._id, "owner": Meteor.userId(), "liked": true}).count();
            if(isTrue > 0) {
                retval = false;
            } else {
                retval = true;
            }
            returnDetails["icon"] = retval;
            returnDetails["isNew"] = false;
            return returnDetails;
        } else {
            returnDetails["icon"] = "both";
            returnDetails["isNew"] = true;
            return returnDetails;
        }
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
    'click .like-post'(event, instance) {
        //get the incoming button value from the click event
        var getText = event.target.value;

        //check if the user has already liked this post
        var checkIfLiked = Likes.find({"typeid": this._id, "owner": Meteor.userId()}).count();

        //get the button value to be used if the user liked the post
        //can be moved into other if.
        if(getText == 'true') {
            getText = true;
        } else {
            getText = false;
        }

        //if is new run insert based on which button was clicked
        if(checkIfLiked < 1) {

            if(getText == true) {
                Meteor.call('likes.insert', true, "post", this._id);
            } else {
                Meteor.call('likes.insert', false, "post", this._id);
            }

            //else update the record based on if they previously liked or disliked the post.
        } else {
            var checkIfFalse = Likes.find({"typeid": this._id, "owner": Meteor.userId(), "liked": false}).count();
            if(checkIfFalse < 1) {
                Meteor.call('likes.updateAfterLiked', false, this._id);
            } else {
                Meteor.call('likes.updateAfterLiked', true, this._id);

            }

        }
    },
});