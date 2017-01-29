import {Meteor} from 'meteor/meteor';

import {capitalize} from '../../startup/utilities';

Meteor.users.helpers({
    fullName() {
        return `${capitalize(this.profile.firstName)} ${capitalize(this.profile.lastName)}`;
    }
});