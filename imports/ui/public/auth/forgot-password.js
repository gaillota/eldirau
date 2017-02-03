import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {NotificationService} from '../../../startup/services';
import {ForgotPasswordForm} from '../../../startup/common/forms/auth';

import './forgot-password.html';

const templateName = "public.auth.forgot-password";

Template[templateName].helpers({
    forgotPasswordForm() {
        return ForgotPasswordForm;
    },
    formId() {
        return templateName;
    }
});

AutoForm.addHooks(templateName, {
    onSuccess() {
        NotificationService.success('Your account has been found. Check your inbox');
    }
});