import {Template} from "meteor/templating";
import {Counts} from 'meteor/tmeasday:publish-counts';

import {toggleModal} from '../../../startup/utilities';

import './users.html';

import '../modals/users/roles.modal';

const templateName = 'admin.users';

Template[templateName].onCreated(function () {
    this.subscribe('users.admin');
    this.subscribe('users.admin.count');
});

Template[templateName].helpers({
    usersCount() {
        return Counts.get('users.admin.count');
    },
    users() {
        return Meteor.users.find({}, {
            sort: {
                "profile.firstName": 1
            }
        });
    }
});

Template[templateName].events({
    'click .js-edit-roles'() {
        toggleModal('user.roles', this._id);
    }
});
