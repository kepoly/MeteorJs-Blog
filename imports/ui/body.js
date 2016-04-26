/**
 * Created by kepoly on 4/20/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Posts } from '../api/posts';
import { Categories } from '../api/categories';

import './post/post';
import './body.html';
import './headfoot.html';


Template.home.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('posts');
    Meteor.subscribe('categories');
});

Template.headfoot.onCreated(function headFootOnCreated() {
   this.state = new ReactiveDict();

    //maybe localstorage is better here?
    if(Session.get('hidePost') === undefined) {
        Session.set('hidePost', 'true');
    } else {
        Session.set('hidePost', Session.get('hidePost'));
    }
});

//Check if the user wants to return a specific users posts.
//Else return all.
//Get the total count of blog posts for the signed in user.
//Get the total amount of posts in the whole blog.


CheckPostsIndex = new EasySearch.Index({
    collection: Posts,
    fields: ['title', 'body', 'username', 'createdAt', 'categoryname'],
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {createdAt: -1};
        }
    })
});


Template.home.helpers({
    postsIndex: () => CheckPostsIndex,
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
    },
    attributes() {
        return { name: 'postsSearch',
            placeholder: "Search by Title, Author, Category or Key Terms"
        };
    },
    returnHidePost() {
        return Session.get('hidePost');
    }
});

//add a helper to get the current users session name that is set
//in the click getall event.
Template.registerHelper('session',function(){
    return Session.get('showUser');
});

Template.registerHelper('showHidePost', function() {
    return Session.get('hidePost');
});

Template.headfoot.helpers({
    returnHidePost() {
        return Session.get('hidePost');
    },
    categories() {
        return Categories.find({ private: false }, { sort: { title: 1 }});
    }
});

Template.headfoot.events({
    'submit .new-blog-post'(event) {
        event.preventDefault();

        //retrieve the values from form event.
        const target = event.target;
        const title = target.title.value;
        const body = target.body.value;
        const category = target.category.value;

        //because we want to include the category name without another db call.
        var split = category.split('+', 2);
        var catid = split[0];
        var catname = split[1];

        const isPrivate = target.isPrivate.checked;
        //call the method insert with title and body as params.
        Meteor.call('posts.insert', title, body, catid, catname, isPrivate);

        //reset the fields after insert.
        target.title.value = '';
        target.body.value = '';
        Session.set('hidePost', true);
    },
    'submit .new-blog-category'(event) {
        event.preventDefault();

        //retrieve the values from form event.
        const target = event.target;
        const title = target.title.value;
        const body = target.body.value;

        const isPrivate = target.isPrivate.checked;
        //call the method insert with title and body as params.
        Meteor.call('categories.insert', title, body, isPrivate);

        //reset the fields after insert.
        target.title.value = '';
        target.body.value = '';
        Session.set('hidePost', true);
    },
    'click .toggle-new-post'(event) {
        Session.set('hidePost', !Session.get('hidePost'));
    }
});


Template.home.events({
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
    }
});
