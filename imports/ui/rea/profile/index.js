import {Template} from "meteor/templating";
import {Accounts} from 'meteor/accounts-base';

import {NotificationService} from '../../../startup/services/_notification.service';
import {ChangePasswordForm} from '../../../startup/common/forms/profile';

import './index.html';

const templateName = 'rea.profile';

Template[templateName].helpers({
    changePasswordForm() {
        return ChangePasswordForm
    }
});

AutoForm.addHooks('rea.profile.change-password', {
    onSubmit(doc) {
        this.event.preventDefault();

        Accounts.changePassword(doc.oldPassword, doc.newPassword, this.done);
    },
    onSuccess() {
        NotificationService.success('Password successfully changed !');
    }
});



