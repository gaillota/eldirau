import {Template} from "meteor/templating";
import {Roles} from 'meteor/alanning:roles';

import './roles.modal.html';

import {NotificationService} from '../../../../startup/services';
import {updateRoles} from '../../../../api/users/methods';
import {getModalData, toggleModal} from '../../../../startup/utilities';

import roles from '../../../../startup/client/roles';

const templateName = 'admin.users.roles.modal';
const modalName = 'admin.users.roles';

Template[templateName].onCreated(function() {
    this.getUserId = () => getModalData(modalName);
    this.state = new ReactiveDict();

    this.autorun(() => {
        this.subscribe('users.admin', this.getUserId());
    });

    this.autorun(() => {
        this.state.set('userRoles', Roles.getRolesForUser(this.getUserId()) || []);
    });
});

Template[templateName].helpers({
    isActive() {
        return getModalData(modalName) && 'is-active';
    },
    roles() {
        return roles;
    },
    checked() {
        return Template.instance().state.get('userRoles').indexOf(this.role) >= 0 && 'checked';
    }
});

Template[templateName].events({
    'click .js-toggle-share'(event, template) {
        event.preventDefault();

        let roles = template.state.get('userRoles');

        if (roles.indexOf(this.role) >= 0) {
            roles = roles.filter(role => role !== this.role);
        } else {
            roles.push(this.role);
        }

        template.state.set('userRoles', roles);
    },
    'click .js-save'(event, template) {
        event.preventDefault();

        updateRoles.call({userId: template.getUserId(), roles: template.state.get('userRoles')}, error => {
            if (error) {
                NotificationService.error(error.reason || error.toString());
            }

            toggleModal(modalName, undefined);
        });
    },
    'click .js-hide-modal'(event) {
        event.preventDefault();

        toggleModal(modalName, undefined);
    }
});
