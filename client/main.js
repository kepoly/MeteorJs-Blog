import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';
import '../imports/ui/user/user'
import '../imports/ui/post/singlepost';
import '../imports/ui/category/category';
import '../imports/ui/loading.html';
import '../imports/ui/headfoot.html';



Router.configure({
    layoutTemplate: 'headfoot',
    loadingTemplate: 'loading'
});

Router.route('/', {
    template: 'home',
});

Router.route('/u/:username', {
    template: 'user',
    data: function() {
        userdata: {
            var currentUser = this.params.username;
            return currentUser;
        }

    }
});

Router.route('/p/:postname/:username', {
    template: 'singlepost',
    data: function() {
        postdata: {
            var currentPost = this.params.postname;
            var currentUser = this.params.username;
            var retVal = {'postTitle': currentPost, 'userName': currentUser};
            return retVal;
        }
    }
});

Router.route('/c/:category', {
    template: 'category',
        data: function() {
        postdata: {
            var id = this.params.category;
            return id;
        }
    }

});

Router.route('/b/:badge', function () {
    var id = this.params.badge;
    console.log(id);
    this.render('loading');
});

