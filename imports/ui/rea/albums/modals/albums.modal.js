import {Template} from "meteor/templating";
import {AutoForm} from 'meteor/aldeed:autoform';
import {_} from 'lodash';

import {Albums} from '../../../../api/albums/albums';
import {form as AlbumForm} from '../../../../startup/common/forms/albums/album.form'
import {upsert} from '../../../../api/albums/methods';
import {getModalData, toggleModal} from '../../../../startup/utilities';

import './albums.modal.html';

const templateName = "rea.albums.modals";
const modalName = "album.modal";

Template[templateName].onCreated(function () {
    this.getAlbumId = () => getModalData(modalName);
    this.isEditing = () => {
        const albumId = this.getAlbumId();
        return _.isString(albumId) && Albums.find(albumId).count();
    }
});

Template[templateName].helpers({
    isActive() {
        return getModalData(modalName) && 'is-active';
    },
    title() {
        return Template.instance().isEditing() ? `Editing ${Albums.findOne(getModalData(modalName)).name}` : 'Create new album';
    },
    albumForm() {
        return AlbumForm;
    },
    modalId() {
        return modalName;
    },
    album() {
        return Template.instance().isEditing() && Albums.findOne(getModalData(modalName));
    }
});

Template[templateName].events({
    'click .js-hide-modal'(event) {
        event.preventDefault();

        toggleModal(modalName, false);
    }
});

AutoForm.addHooks(modalName, {
    onSubmit(doc) {
        this.event.preventDefault();
        const template = this.template.parent();

        const albumId = template.getAlbumId();
        if (template.isEditing()) {
            doc.albumId = albumId;
        }

        upsert.call(doc, this.done);
    },
    onSuccess(formType, result) {
        const template = this.template.parent();

        if (!template.isEditing()) {
            FlowRouter.go('rea.albums.gallery', {albumId: result});
        }
        toggleModal(modalName, false);
    }
});