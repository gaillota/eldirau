import {Template} from "meteor/templating";
import {Counts} from 'meteor/tmeasday:publish-counts';

import './overview.html';

const templateName = 'admin.overview';

Template[templateName].onCreated(function () {
    this.subscribe('users.admin.count');
    this.subscribe('albums.admin.count');
    this.subscribe('photos.admin.count');
    this.subscribe('comments.admin.count');
});

Template[templateName].helpers({
    usersCount() {
        return Counts.get('users.admin.count');
    },
    albumsCount() {
        return Counts.get('albums.admin.count');
    },
    photosCount() {
        return Counts.get('photos.admin.count');
    },
    likesCount() {
        return 0;
    },
    commentsCount() {
        return Counts.get('comments.admin.count');
    }
});
