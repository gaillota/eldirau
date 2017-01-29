import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {AlbumManager} from '../../startup/services/album.manager';

import './index.html';

import '../components/sidemenu.component';
import '../rea/albums/components/card.component';

const templateName = "rea.index";

Template[templateName].onCreated(function () {
    this.limit = 3;
    this.subscribe('albums.user', this.limit);
    this.subscribe('albums.shared', this.limit);
});

Template[templateName].helpers({
    myAlbums() {
        return AlbumManager.findUserAlbums(Meteor.userId(), {}, {
            sort: {
                createdAt: -1
            },
            limit: Template.instance().limit
        });
    },
    albumsSharedWithMe() {
        return AlbumManager.findAlbumsSharedWithUser(Meteor.userId(), {}, {
            sort: {
                createdAt: -1
            },
            limit: Template.instance().limit
        });
    }
});