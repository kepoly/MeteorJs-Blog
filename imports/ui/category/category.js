/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Posts } from '../../api/posts.js';

import './category.html';

if(Meteor.isServer) {
    Meteor.publish('posts', function postsPublication() {
        return Posts.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.categoryId },
            ],
        });
    });
}

Template.category.onCreated(function categoryOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('posts');
});

Template.category.helpers({
    categorydata() {
        return Template.instance().data;
    },
    categoryposts() {
        return Posts.find({ categoryname: { $in: [Template.instance().data] } }, { sort: { createdAt: -1 }  });
    },
    categoryOwner() {
        return Posts.findOne({ categoryname: { $in: [Template.instance().data] } });
    },
    totalposts() {
        return Posts.find({ categoryname: { $in: [Template.instance().data] } }).count();
    }

});

Template.category.events({

});