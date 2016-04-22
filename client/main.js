import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';
import '../imports/ui/loading.html';

Router.route('/',function() {
    this.render('home'), {

    }
});

Router.route('/u/:username', function () {
    var id = this.params.username;
    console.log(id);
    this.render('loading');
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

