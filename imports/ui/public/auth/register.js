import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {RegistrationForm} from '../../../startup/common/forms/auth';
import {NotificationService} from '../../../startup/services/notification.service';

import './register.html';

const templateName = 'public.auth.register';

Template[templateName].helpers({
    registrationForm() {
        return RegistrationForm;
    }
});

AutoForm.addHooks(templateName, {
    onSuccess: function() {
        NotificationService.success('Registration successful ! Check your inbox.');
    }
});