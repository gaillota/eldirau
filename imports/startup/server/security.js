import {Meteor} from 'meteor/meteor';

Meteor.startup(() => {
    BrowserPolicy.content.allowImageOrigin("http://*.gravatar.com");
    BrowserPolicy.content.allowImageOrigin("http://bulma.io");
    BrowserPolicy.content.allowImageOrigin("http://placehold.it");
    BrowserPolicy.content.allowImageOrigin("http://*.imgix.net");
});