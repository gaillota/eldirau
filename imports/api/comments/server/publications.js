import {Meteor} from 'meteor/meteor';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Roles} from 'meteor/alanning:roles';

import {Comments} from '../comments';

Meteor.publish('comments.admin.count', function () {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'ADMIN')) {
        return this.ready();
    }

    Counts.publish(this, 'comments.admin.count', Comments.find({"deletedAt": {$exists: false}}));

    return this.ready();
});
