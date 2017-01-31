import {Template} from "meteor/templating";

import {toggleModal} from '../../../../startup/utilities';

import './share.button.html';

const templateName = "rea.albums.share.button";

Template[templateName].helpers({
    text() {
        return Template.currentData().text || 'Share';
    }
});

Template[templateName].events({
    'click .js-share-album'() {
        if (Template.currentData().albumId) {
            toggleModal('album.share', Template.currentData().albumId);
        }
    }
});