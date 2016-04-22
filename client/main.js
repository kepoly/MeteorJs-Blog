import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';
import '../imports/ui/user/user'
import '../imports/ui/loading.html';
import '../imports/ui/headfoot.html';


Router.configure({
    layoutTemplate: 'headfoot'
});

Router.route('/',function() {
    this.render('home'), {

    }
});

Router.route('/u/:username', {
    template: 'user',
    subscribe: 'posts',
    data: function() {
        userdata: {
            var currentUser = this.params.username;
            return currentUser;
        }

    }
});

Router.route('/c/:category', function () {
    var id = this.params.category;
    console.log(id);
    this.render('loading');
});

Router.route('/b/:badge', function () {
    var id = this.params.badge;
    console.log(id);
    this.render('loading');
});

