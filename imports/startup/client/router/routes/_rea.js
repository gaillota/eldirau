import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../../../ui/layout';
import '../../../../ui/rea/index';

FlowRouter.route('/', {
    name: 'rea.index',
    action() {
        BlazeLayout.render('layout', {page: 'rea.index'});
    }
});