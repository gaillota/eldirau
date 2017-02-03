import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../../../ui/layout';
import '../../../../ui/rea/profile/index';

FlowRouter.route('/profile', {
    name: 'rea.profile',
    action() {
        BlazeLayout.render('layout', {page: 'rea.profile'});
    }
});
