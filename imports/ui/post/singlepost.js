
/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { Posts } from '../../api/posts.js';

import './singlepost.html';

Template.singlepost.onCreated(function singlepostOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('posts');
});

Template.singlepost.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
    postdata() {
        return Template.instance().data;
    },
    posts() {
        return Posts.find({ title: { $in: [Template.instance().data] } }, { sort: { createdAt: -1 }  });
    }
});

Template.singlepost.events({

});