import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/kadira:flow-router";
import {ReactiveVar} from "meteor/reactive-var";
import {Counts} from "meteor/tmeasday:publish-counts";
import {_} from "lodash";

import {Albums} from "../../../api/albums/albums";

import './view.html';

const templateName = "rea.albums.view";

Template[templateName].onCreated(function () {
    this.getAlbumId = () => FlowRouter.getParam("albumId");
    this.limit = new ReactiveVar(10);

    this.autorun(() => {
        this.subscribe('album', this.getAlbumId());
        // this.subscribe('photos.album', this.getAlbumId(), this.limit.get(), () => console.log('subs 2 ready'));
    });
});

Template[templateName].helpers({
    subsReady() {
        return Template.instance().subscriptionsReady();
    },
    album() {
        return Albums.findOne(Template.instance().getAlbumId());
    },
    countPhotos() {
        return Counts.get('album.photos.count');
    },
    fakePhotos() {
        const sizes = [100, 200, 300, 400];
        return _.range(30).map(i => ({
            src: `http://placehold.it/${sizes[_.random(sizes.length - 1)]}x${sizes[_.random(sizes.length - 1)]}`
        }));
    }
});