import {Template} from "meteor/templating";
import {FlowRouter} from 'meteor/kadira:flow-router';

import './menu.component.html';

import {routes} from '../../../startup/client/router/routes';

const templateName = 'admin.component.menu';

Template[templateName].helpers({
    sections() {
        return routes;
    },
    active(name) {
        return name == FlowRouter.getRouteName() && 'is-active';
    }
});
