import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';
import {Session} from 'meteor/session';

import '../../../../ui/layout';
import '../../../../ui/rea/index';
import '../../../../ui/rea/albums/view';

FlowRouter.route('/', {
    name: 'rea.index',
    action() {
        BlazeLayout.render('layout', {page: 'rea.index'});
    }
});

const albumGroup = FlowRouter.group({
    prefix: '/albums'
});

albumGroup.route('/:albumId', {
    name: 'rea.albums.view',
    action() {
        BlazeLayout.render('layout', {page: 'rea.albums.view'});
    }
});

albumGroup.route('/:albumId/photo/:photoId', {
    name: 'rea.albums.photo.view',
    action() {
        Session.set('photo.view', true);

        BlazeLayout.render('layout', {page: 'rea.albums.view'});
    },
    triggersExit: [() => {
        Session.set('photo.view', false);
    }]
});