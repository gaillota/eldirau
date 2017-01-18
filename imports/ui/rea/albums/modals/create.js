import {Template} from "meteor/templating";

import {CreateAlbumForm} from '../../../../startup/common/forms/albums/create.form'
import {create} from '../../../../api/albums/methods';
import {isModalActive, hideModal} from '../../../../startup/utilities';

import './create.html';

const templateName = "rea.albums.modals.create";
const modalName = "createAlbumModal";

Template[templateName].helpers({
    createAlbumForm() {
        return CreateAlbumForm;
    },
    isActive() {
        return isModalActive(modalName);
    }
});

AutoForm.addHooks(modalName, {
    onSubmit(doc) {
        create.call(doc, this.done);
    },
    onSuccess(formType, result) {
        console.log(result);
        hideModal(modalName);
        FlowRouter.go('rea.albums.show', {albumId: result});
    }
});