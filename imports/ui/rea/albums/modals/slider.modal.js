import {Template} from "meteor/templating";
import {$} from 'meteor/jquery';
import {ReactiveDict} from 'meteor/reactive-dict';
import {FlowRouter} from "meteor/kadira:flow-router";
import {AutoForm} from 'meteor/aldeed:autoform';

import {Photos} from '../../../../api/photos/photos';
import {Comments} from '../../../../api/comments/comments';
import {PhotoRepository} from '../../../../startup/repositories';
import {form as PhotoForm} from '../../../../startup/common/forms/photos/photo.form';
import {update, remove, like} from '../../../../api/photos/methods';
import {comment, uncomment} from '../../../../api/comments/methods';
import displayError from '../../../lib/displayError';

const templateName = "rea.albums.slider.modal";

import './slider.modal.html';

Template[templateName].onCreated(function () {
    this.getPhotoId = () => FlowRouter.getParam("photoId");
    this.getAlbumId = () => FlowRouter.getParam('albumId');
    this.getPreviousPhoto = () => PhotoRepository.findPreviousPhotoFrom(this.getPhotoId()).fetch()[0];
    this.getNextPhoto = () => PhotoRepository.findNextPhotoFrom(this.getPhotoId()).fetch()[0];
    this.goTo = photo => photo ? FlowRouter.go('rea.albums.photo.slider', {albumId: this.getAlbumId(), photoId: photo._id}) : '';
    this.closeModal = () => {
        if (this.getAlbumId()) {
            FlowRouter.go('rea.albums.gallery', {albumId: this.getAlbumId()});
        }
    };

    this.state = new ReactiveDict();
    this.isState = (name) => this.state.get(name);
    this.showEditForm = () => this.state.set('editing', true);
    this.hideEditForm = () => this.state.set('editing', undefined);
    this.toggleShift = () => this.state.set('shift', !this.isState('shift'));

    this.autorun(() => {
        this.subscribe('photo.view', this.getPhotoId(), displayError);
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
                this.goTo(this.getPreviousPhoto());
                break;
            case 39:
                // Right
                this.goTo(this.getNextPhoto());
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
        return Template.instance().getPreviousPhoto();
    },
    nextPhoto() {
        return Template.instance().getNextPhoto();
    },
    owner(userId) {
        return Meteor.users.findOne(userId);
    },
    likeButtonActive() {
        const likes = this.meta.likes || [];

        return likes.indexOf(Meteor.userId()) >= 0 && 'active';
    },
    isOwner(userId) {
        return userId === Meteor.userId();
    },
    editing() {
        return Template.instance().isState('editing');
    },
    photoForm() {
        return PhotoForm;
    },
    likes() {
        const likes = this.meta.likes || [];

        if (!likes.length) {
            return;
        }

        const me = likes.indexOf(Meteor.userId());
        if (me >= 0) {
            likes.splice(me, 1);
            likes.splice(0, 0, Meteor.userId());
        }

        return likes.length < 4 ? `${likes.map(like => like === Meteor.userId() ? 'You' : Meteor.users.findOne(like).fullName()).join(", ")} like this` : `${likes.length} likes.`;
    },
    comments() {
        return Comments.find({
            photoId: this._id
        });
    },
    isAuthor() {
        return this.userId === Meteor.userId();
    }
});

Template[templateName].events({
    'click .js-close'(event, template) {
        event.preventDefault();

        template.closeModal();
    },
    'click .js-photo-next'(event, template) {
        event.preventDefault();

        template.goTo(template.getNextPhoto());
    },
    'click .js-photo-edit'(event, template) {
        event.preventDefault();

        template.showEditForm();
    },
    'click .js-photo-remove'(event, template) {
        event.preventDefault();

        if (confirm('Are you sure you want to delete this photo ?')) {
            remove.call({photoId: template.getPhotoId()}, displayError);
            template.closeModal();
        }
    },
    'click .js-cancel-editing'(event, template) {
        event.preventDefault();

        template.hideEditForm();
    },
    'click .js-like-photo'(event, template) {
        event.preventDefault();

        like.call({photoId: template.getPhotoId()});
    },
    'keydown .js-comment-input'(event, template) {
        switch (event.keyCode) {
            case 13:
                // Enter
                if (!template.isState('shift')) {
                    event.preventDefault();
                    const text = event.target.value.trim();
                    if (text) {
                        comment.call({
                            photoId: template.getPhotoId(),
                            text: event.target.value
                        }, displayError);
                        event.target.value = '';
                    }
                }
                break;
            case 16:
                // Shift
                if (!template.isState('shift')) {
                    template.toggleShift();
                }
                break;
            default:
                break;
        }
    },
    'keyup .js-comment-input'(event, template) {
        if (event.keyCode === 16) {
            template.toggleShift();
        }
    },
    'click .js-delete-comment'(event) {
        event.preventDefault();

        if (confirm('Are you sure you want to delete this comment ?')) {
            uncomment.call({
                commentId: this._id
            }, displayError);
        }
    }
});

AutoForm.addHooks('photo.modal.edit', {
    onSubmit(doc) {
        this.event.preventDefault();
        const template = this.template.parent();

        doc.photoId = template.getPhotoId();

        update.call(doc, displayError);
        template.hideEditForm();
    }
});
