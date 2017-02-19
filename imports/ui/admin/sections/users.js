import {Template} from "meteor/templating";
import {Counts} from 'meteor/tmeasday:publish-counts';

import {activate} from '../../../api/users/methods';
import {toggleModal} from '../../../startup/utilities';
import {displayError} from '../../lib/displayError';

import './users.html';

import '../modals/users/roles.modal';
import '../modals/users/enroll.modal';

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
    },
    emailNotVerified() {
        return !this.emails[0].verified;
    },
});

Template[templateName].events({
    'click .js-edit-roles'() {
        toggleModal('admin.users.roles', this._id);
    },
    'click .js-enroll-user'() {
        toggleModal('admin.users.enroll');
    },
    'click .js-activate-user'() {
        activate.call({userId: this._id}, displayError);
    },
});
