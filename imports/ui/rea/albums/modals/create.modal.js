import {Template} from "meteor/templating";

import {CreateAlbumForm} from '../../../../startup/common/forms/albums/create.form'
import {create} from '../../../../api/albums/methods';
import {isModalActive, triggerModal} from '../../../../startup/utilities';

import './create.modal.html';

const templateName = "rea.albums.modals.create";
const modalName = "createAlbumModal";

Template[templateName].helpers({
    createAlbumForm() {
        return CreateAlbumForm;
    },
    isActive() {
        return isModalActive(modalName) && 'is-active';
    }
});

Template[templateName].events({
    'click .js-hide-modal'(event) {
        event.preventDefault();

        triggerModal(modalName, false);
    }
});

AutoForm.addHooks(modalName, {
    onSubmit(doc) {
        this.event.preventDefault();

        create.call(doc, this.done);
    },
    onSuccess(formType, result) {
        triggerModal(modalName, false);
        FlowRouter.go('rea.albums.view', {albumId: result});
    }
});