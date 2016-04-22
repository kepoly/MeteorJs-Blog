/**
 * Created by kepoly on 4/21/2016.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//create a new mongo collection to hold the blog posts

if(Meteor.isServer) {
    Meteor.publish('users', function postsPublication() {
        return Users.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({

});