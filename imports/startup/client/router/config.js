import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../../ui/layout';
import '../../../ui/not-found';

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('layout', {page: 'not-found'});
    }
};