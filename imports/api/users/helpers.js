import {Meteor} from 'meteor/meteor';

Meteor.users.helpers({
    fullName() {
        return `${this.profile.firstName} ${this.profile.lastName}`;
    }
});