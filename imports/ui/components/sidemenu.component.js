import {Template} from "meteor/templating";
import {Counts} from "meteor/tmeasday:publish-counts";

import './sidemenu.component.html';

import './loading.component';

Template.sidemenu.onCreated(function () {
    this.subscribe('my.albums.count');
    this.subscribe('shared.albums.count');
});

Template.sidemenu.helpers({
    myAlbumsCount() {
        return Counts.get('my.albums.count');
    },
    albumsSharedCount() {
        return Counts.get('shared.albums.count');
    }
});