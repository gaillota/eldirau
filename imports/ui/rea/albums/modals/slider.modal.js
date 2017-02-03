import {Template} from "meteor/templating";
import {$} from 'meteor/jquery';
import {ReactiveVar} from 'meteor/reactive-var';
import {FlowRouter} from "meteor/kadira:flow-router";
import {AutoForm} from 'meteor/aldeed:autoform';

import {Photos} from '../../../../api/photos/photos';
import {PhotoRepository} from '../../../../startup/services';
import {form as PhotoForm} from '../../../../startup/common/forms/albums/album.form';
import {update, remove} from '../../../../api/photos/methods';
import {NotificationService} from '../../../../startup/services';

const templateName = "rea.albums.slider.modal";

import './slider.modal.html';

Template[templateName].onCreated(function () {
    this.getPhotoId = () => FlowRouter.getParam("photoId");
    this.getAlbumId = () => FlowRouter.getParam('albumId');
    this.closeModal = () => {
        if (this.getAlbumId()) {
            FlowRouter.go('rea.albums.gallery', {albumId: this.getAlbumId()});
        }
    };
    this.editing = new ReactiveVar();
    this.showEditForm = () => this.editing.set(true);
    this.hideEditForm = () => this.editing.set(undefined);

    this.autorun(() => {
        this.subscribe('photo.view', this.getPhotoId());
    });
});

Template[templateName].onRendered(function () {
    $(document).on('keyup', (e) => {
        switch (e.keyCode) {
            case 27:
                // ESC
                this.closeModal();
                break;
            case 37:
                // Left
                const previousPhoto = PhotoRepository.findPreviousPhotoFrom(this.getPhotoId()).fetch()[0];
                if (previousPhoto) {
                    FlowRouter.go('rea.albums.photo.slider', {albumId: this.getAlbumId(), photoId: previousPhoto._id});
                }
                break;
            case 39:
                // Right
                const nextPhoto = PhotoRepository.findNextPhotoFrom(this.getPhotoId()).fetch()[0];
                if (nextPhoto) {
                    FlowRouter.go('rea.albums.photo.slider', {albumId: this.getAlbumId(), photoId: nextPhoto._id});
                }
                break;
        }
    });
});

Template[templateName].onDestroyed(function() {
    $(document).off('keyup');
});

Template[templateName].helpers({
    photo() {
        return Photos.collection.findOne(Template.instance().getPhotoId());
    },
    previousPhoto() {
        return PhotoRepository.findPreviousPhotoFrom(Template.instance().getPhotoId()).fetch()[0];
    },
    nextPhoto() {
        return PhotoRepository.findNextPhotoFrom(Template.instance().getPhotoId()).fetch()[0];
    },
    owner(userId) {
        return Meteor.users.findOne(userId);
    },
    isOwner(userId) {
        return userId === Meteor.userId();
    },
    editing() {
        return Template.instance().editing.get();
    },
    photoForm() {
        return PhotoForm;
    }
});

Template[templateName].events({
    'click .js-close'(event, template) {
        event.preventDefault();

        template.closeModal();
    },
    'click .js-photo-edit'(event, template) {
        event.preventDefault();

        template.showEditForm();
    },
    'click .js-photo-remove'(event, template) {
        event.preventDefault();

        if (confirm('Are you sure you want to delete this photo ?')) {
            remove.call({photoId: template.getPhotoId()}, (error) => {
                if (error) {
                    NotificationService.error(error.toString());
                }
            });
            template.closeModal();
        }
    },
    'click .js-cancel-editing'(event, template) {
        event.preventDefault();

        template.hideEditForm();
    }
});

AutoForm.addHooks('photo.modal.edit', {
    onSubmit(doc) {
        this.event.preventDefault();
        const template = this.template.parent();

        doc.photoId = template.getPhotoId();

        update.call(doc, (error) => {
            if (error) {
                NotificationService.error(error.toString());
            }
        });
        template.hideEditForm();
    }
});
