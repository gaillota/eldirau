import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/kadira:flow-router";

import {Photos} from '../../../../api/photos/photos';

const templateName = "rea.photo-view.modal";

import './photo-view.modal.html';

Template[templateName].onCreated(function () {
    this.getPhotoId = () => FlowRouter.getParam("photoId");

    this.autorun(() => {
        this.subscribe('photo.view', this.getPhotoId());
    });
});

Template[templateName].helpers({
    photos() {
        return Photos.find(Template.instance().getPhotoId()).cursor;
    }
});

Template[templateName].events({
    'click .js-close'(event) {
        event.preventDefault();

        FlowRouter.go('rea.albums.view', {albumId: FlowRouter.getParam('albumId')})
    }
});