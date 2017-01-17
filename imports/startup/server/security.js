import {Meteor} from 'meteor/meteor';

Meteor.startup(() => {
    BrowserPolicy.content.allowImageOrigin("http://*.gravatar.com");
});