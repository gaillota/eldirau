import {Meteor} from 'meteor/meteor';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Roles} from 'meteor/alanning:roles';

Meteor.publish("admin.accounts", function adminAccounts() {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        return this.ready();
    }

    const nonAdmin = {
        roles: {
            $ne: 'admin'
        }
    };

    Counts.publish(this, "counts.accounts", Meteor.users.find(nonAdmin));

    return Meteor.users.find(nonAdmin, {
        fields: {
            createdAt: 1,
            username: 1,
            emails: 1,
            profile: 1,
            status: 1,
            roles: 1,
            lastConnectionAt: 1,
            disabled: 1
        }
    });
});