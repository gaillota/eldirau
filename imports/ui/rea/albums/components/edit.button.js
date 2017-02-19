import {Template} from "meteor/templating";

import {toggleModal} from '../../../../startup/utilities';

import './edit.button.html';

const templateName = "rea.albums.edit.button";

Template[templateName].helpers({
    type() {
        return Template.currentData().type;
    },
    text() {
        return Template.currentData().text || 'Edit';
    }
});

Template[templateName].events({
    'click .js-edit-album'() {
        if (Template.currentData().albumId) {
            toggleModal('album.modal', Template.currentData().albumId);
        }
    }
});
