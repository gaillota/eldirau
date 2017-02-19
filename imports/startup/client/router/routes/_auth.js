import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';
import {Accounts} from 'meteor/accounts-base';

import {NotificationService} from '../../../services';
import {resetDispatcher} from '../../../utilities';

import '../../../../ui/layout';
import '../../../../ui/public/auth/register';
import '../../../../ui/public/auth/login';
import '../../../../ui/public/auth/forgot-password';
import '../../../../ui/public/auth/reset-password';


FlowRouter.route('/register', {
    name: 'public.auth.register',
    action() {
        BlazeLayout.render('layout', {page: 'public.auth.register'});
    }
});

FlowRouter.route('/login', {
    name: 'public.auth.login',
    action() {
        BlazeLayout.render('layout', {page: 'public.auth.login'});
    },
    triggersExit: [resetDispatcher]
});

FlowRouter.route('/verify-email/:token', {
    name: 'public.auth.verify-email',
    action(params) {
        Accounts.verifyEmail(params.token, function (error) {
            if (error) {
                NotificationService.error(error.toString());
            } else {
                NotificationService.success('Your account is now activated. Welcome on Eldir.au !');
            }
            FlowRouter.go('rea.index');
        });
    }
});

FlowRouter.route('/forgot-password', {
    name: 'public.auth.forgot-password',
    action() {
        BlazeLayout.render('layout', {page: 'public.auth.forgot-password'});
    }
});

FlowRouter.route('/reset-password/:token', {
    name: 'public.auth.reset-password',
    action() {
        BlazeLayout.render('layout', {page: 'public.auth.reset-password'});
    }
});
