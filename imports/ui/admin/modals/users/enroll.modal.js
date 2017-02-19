import {Template} from "meteor/templating";
import {Roles} from 'meteor/alanning:roles';

import './enroll.modal.html';

import {EnrollForm} from '../../../../startup/common/forms/admin/enroll.form';
import {NotificationService} from '../../../../startup/services';
import {getModalData, toggleModal} from '../../../../startup/utilities';

const templateName = 'admin.users.enroll.modal';
const modalName = 'admin.users.enroll';
const formId = "users.enroll";

Template[templateName].helpers({
    isActive() {
        return getModalData(modalName) && 'is-active';
    },
    enrollForm() {
        return EnrollForm;
    },
    formId() {
        return formId;
    }
});

Template[templateName].events({
    'click .js-hide-modal'(event) {
        event.preventDefault();

        toggleModal(modalName, undefined);
    }
});

AutoForm.addHooks(formId, {
    onSuccess() {
        NotificationService.success('User successfully invited');
    }
});
