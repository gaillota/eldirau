import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../../../ui/layout';
import '../../../../ui/admin/layout';
import '../../../../ui/admin/sections/overview';
import '../../../../ui/admin/sections/users';
import '../../../../ui/admin/sections/albums';

export const routes = [
    {
        name: 'admin',
        path: '/',
        template: 'admin.overview',
        friendlyName: 'Overview'
    },
    {
        name: 'admin.users',
        path: '/users',
        template: 'admin.users',
        friendlyName: 'Users'
    },
    {
        name: 'admin.albums',
        path: '/albums',
        template: 'admin.albums',
        friendlyName: 'Albums'
    }
];

const adminGroup = FlowRouter.group({
    prefix: '/admin',
    triggersEnter: [FlowRouter.triggersFunctions.isAdmin]
});

routes.forEach(route => {
    adminGroup.route(route.path, {
        name: route.name,
        action() {
            BlazeLayout.render('layout', {page: 'admin.layout', section: route.template});
        }
    });
    // if (route.default) {
    //     adminGroup.route('/', {
    //         name: 'admin.index',
    //         triggersEnter: [function(context, redirect) {
    //             redirect(FlowRouter.path(route.name));
    //         }],
    //         action() {
    //             throw new Meteor.Error(403, "this should not get called");
    //         }
    //     });
    // }
});


