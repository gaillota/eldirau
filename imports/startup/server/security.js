import {Meteor} from 'meteor/meteor';

Meteor.startup(() => {
    WebApp.rawConnectHandlers.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "http://*.gravatar.com");
        return next();
    });
});