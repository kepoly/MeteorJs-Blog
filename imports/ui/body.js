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

//Check if the user wants to return a specific users posts.
//Else return all.
//Get the total count of blog posts for the signed in user.
//Get the total amount of posts in the whole blog.
Template.body.helpers({
    posts() {
        const instance = Template.instance();

        if(Session.get('showUser') != undefined && Session.get('showUser') != 'all') {
            return Posts.find({ username: Session.get('showUser') }, { sort: { createdAt: -1 } });
        }
        return Posts.find({}, { sort: { createdAt: -1 } });
    },
    userCount() {
        return Posts.find({ owner: { $in: [Meteor.userId()] } }).count();
    },
    totalCount() {
        return Posts.find({ private: false  }, { sort: { createdAt: -1 } }).count();
    }
});

//add a helper to get the current users session name that is set
//in the click getall event.
Template.registerHelper('session',function(){
    return Session.get('showUser');
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
    },
    'click .getall'(event, instance) {
        //get the incoming button value from the click event
        getText = event.target.value;

        //check if access is from the client and set the session value
        if(Meteor.isClient) {
            Session.set("showUser", getText);
            console.log(getText);
        } else {
            console.log('notworking');
        }
    },
});
