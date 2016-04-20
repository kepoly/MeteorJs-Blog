/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';


import './body.html';

Template.body.onCreated(function bodyOnCreated() {

});

Template.body.helpers({

});

Template.body.events({
    'submit .new-blog-post'(event) {
        event.preventDefault(); //prevent the form from submitting.

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