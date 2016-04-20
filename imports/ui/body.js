/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Posts } from '../api/posts';

import './post';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('posts');
});

//Check if the users wants to return only their posts
//Else return all.
//Get the total count of blog posts for the signed in user.
//Get the total amount of posts in the whole blog.
Template.body.helpers({
    posts() {
        const instance = Template.instance();
        if(instance.state.get('hideOthers')) {
            return Posts.find({ owner: { $in: [Meteor.userID()] } , sort: { createdAt: -1 }});
        }
        return Posts.find({}, { sort: { createdAt: -1 } });
    },
    userCount() {
        return Posts.find({ owner: { $in: [Meteor.userId()] } }).count();
    },
    totalCount() {
        return Posts.find({}, { sort: { createdAt: -1 } }).count();
    }
});

Template.body.events({
    'submit .new-blog-post'(event) {
        event.preventDefault();

        //retrieve the values from form event.
        const target = event.target;
        const title = target.title.value;
        const body = target.body.value;

        //call the method insert with title and body as params.
        Meteor.call('posts.insert', title, body);

        //reset the fields after insert.
        target.title.value = '';
        target.body.value = '';
    }
});