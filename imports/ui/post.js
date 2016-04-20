/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { Posts } from '../api/posts.js';

import './post.html';

Template.post.helpers( {
    isOwner() {
        return this.owner === Meteor.userId();
    },
});

Template.post.events({
    'click .delete'() {
        Meteor.call('posts.remove', this._id);
    },
    'click .toggle-edit'() {
        "use strict";
        Meteor.call('posts.edit', this._id, !this.editing);
    },
    'submit .update-post'(event) {
        event.preventDefault();

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
});