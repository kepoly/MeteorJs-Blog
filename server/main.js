import { Meteor } from 'meteor/meteor';

//import the posts.js to allow the server access
import '../imports/api/posts';
import '../imports/api/comments';
import '../imports/api/categories';

Meteor.startup(() => {
  // code to run on server at startup
});
