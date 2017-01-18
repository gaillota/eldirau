import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../../../ui/layout';
import '../../../../ui/rea/albums';

const albumGroup = FlowRouter.group({
    prefix: 'albums'
});

albumGroup.route('/albums/:albumId', {
    name: 'rea.albums.show',
    action() {
        BlazeLayout.render('layout', {page: 'rea.albums.show'});
    }
});