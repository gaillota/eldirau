import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {LoginForm} from '../../../startup/common/forms/auth/_login.form';
import {NotificationService} from '../../../startup/services/notification.service.js';
import {getDispatcherPath} from '../../../startup/utilities';

import './login.html';

const templateName = "public.auth.login";

Template[templateName].helpers({
    loginForm() {
        return LoginForm;
    }
});

AutoForm.addHooks(templateName, {
    onSubmit(doc) {
        this.event.preventDefault();

        Meteor.loginWithPassword(doc.email, doc.password, this.done);
    },
    onSuccess() {
        if (Meteor.user()) {
            NotificationService.success("Welcome back " + Meteor.user().profile.firstName + " ! :)");
        }
        FlowRouter.go(getDispatcherPath() || 'rea.index');
    }
});