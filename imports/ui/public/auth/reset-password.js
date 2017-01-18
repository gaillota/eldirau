import {Template} from "meteor/templating";
import {AutoForm} from "meteor/aldeed:autoform";
import {Accounts} from "meteor/accounts-base";
import {FlowRouter} from "meteor/kadira:flow-router";

import {ResetPasswordForm} from '../../../startup/common/forms/auth';
import {NotificationService} from '../../../startup/services/notification.service';

import "./reset-password.html";

const templateName = "public.auth.reset-password";

Template[templateName].helpers({
    resetPasswordForm() {
        return ResetPasswordForm;
    },
    formId() {
        return templateName;
    }
});

AutoForm.addHooks(templateName, {
    onSubmit: function (doc) {
        this.event.preventDefault();

        Accounts.resetPassword(FlowRouter.getParam("token"), doc.newPassword, this.done);
    },
    onSuccess: function () {
        NotificationService.success('Password successfully reset.');

        FlowRouter.go("public.auth.login");
    }
});