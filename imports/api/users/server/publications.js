import {Meteor} from 'meteor/meteor';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Roles} from 'meteor/alanning:roles';

Meteor.publishComposite('users.search', (search) => {
    return {
        find() {
            let query = {};

            if (search) {
                const pattern = new RegExp(search);
                const fields = ['emails.0.address', 'profile.firstName', 'profile.lastName'];
                query["$or"] = fields.map(f => {
                    const o = {};
                    o[f] = pattern;
                    return o;
                });
            }

            return Meteor.users.find(query, {
                sort: {
                    "profile.lastName": 1
                }
            });
        }
    }
});

Meteor.publish('users.admin.count', function () {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'ADMIN')) {
        return this.ready();
    }

    Counts.publish(this, 'users.admin.count', Meteor.users.find());

    return this.ready();
});

Meteor.publish('users.admin', function (userId) {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'ADMIN')) {
        return this.ready();
    }

    let query = {};
    if (userId) {
        query = {
            userId
        };
    }

    return Meteor.users.find(query);
});
