import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../../../ui/layout';
import '../../../../ui/rea/index';
import '../../../../ui/rea/albums/gallery';

FlowRouter.route('/', {
    name: 'rea.index',
    action() {
        BlazeLayout.render('layout', {page: 'rea.index'});
    }
});

FlowRouter.route('/my-albums', {
    name: 'rea.my-albums',
    action() {
        BlazeLayout.render('layout', {page: 'rea.index', section: 'rea.albums.section.my-albums'});
    }
});

FlowRouter.route('/shared-with-me', {
    name: 'rea.shared-with-me',
    action() {
        BlazeLayout.render('layout', {page: 'rea.index', section: 'rea.albums.section.shared-with-me'});
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

albumGroup.route('/:albumId/photo/:photoId', {
    name: 'rea.albums.photo.slider',
    action() {
        BlazeLayout.render('layout', {page: 'rea.albums.gallery', slider: true});
    },
});
