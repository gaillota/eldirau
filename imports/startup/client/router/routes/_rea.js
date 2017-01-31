import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';
import {Session} from 'meteor/session';

import '../../../../ui/layout';
import '../../../../ui/rea/index';
import '../../../../ui/rea/albums/gallery';

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
    name: 'rea.albums.gallery',
    action() {
        BlazeLayout.render('layout', {page: 'rea.albums.gallery'});
    }
});

albumGroup.route('/:albumId/page/:page', {
    name: 'rea.albums.gallery.page',
    action() {
        BlazeLayout.render('layout', {page: 'rea.albums.gallery'});
    }
});

albumGroup.route('/:albumId/photo/:photoId', {
    name: 'rea.albums.photo.view',
    action() {
        Session.set('photo.view', true);

        BlazeLayout.render('layout', {page: 'rea.albums.gallery'});
    },
    triggersExit: [() => {
        Session.set('photo.view', false);
    }]
});