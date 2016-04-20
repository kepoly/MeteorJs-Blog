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

});