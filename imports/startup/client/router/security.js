import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';
import {Roles} from 'meteor/alanning:roles';

import {NotificationService} from '../../services';
import {setDispatcherPath} from '../../utilities';

FlowRouter.triggersFunctions = {
    isLoggedIn(context, redirect) {
        if (!Meteor.loggingIn() && !Meteor.userId()) {
            setDispatcherPath(context.path);
            redirect('public.auth.login');
        }
    },
    isAdmin(context, redirect) {
        if (!Meteor.loggingIn() && !Meteor.userId()) {
            setDispatcherPath(context.path);
            redirect('public.auth.login');
        } else if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
            NotificationService.error('You must be admin to access this section.');
            redirect('public.index');
        }
    }
};

const NON_AUTH_ROUTES = [
    'public.auth.register',
    'public.auth.login',
    'public.auth.forgot-password',
    'public.auth.reset-password',
    'public.auth.verify-email'
];

// User must be logged in
FlowRouter.triggers.enter(FlowRouter.triggersFunctions.isLoggedIn, {
    except: NON_AUTH_ROUTES
});