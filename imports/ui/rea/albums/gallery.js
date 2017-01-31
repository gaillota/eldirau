import {Template} from "meteor/templating";
import {Session} from 'meteor/session';
import {ReactiveVar} from "meteor/reactive-var";
import {ReactiveDict} from "meteor/reactive-dict";
import {FlowRouter} from "meteor/kadira:flow-router";
import {Counts} from "meteor/tmeasday:publish-counts";
import {_} from "lodash";
import {Random} from 'meteor/random';

import {Albums} from "../../../api/albums/albums";
import {Photos} from '../../../api/photos/photos';
import {remove as removePhoto} from '../../../api/photos/methods';
import {hasRole} from '../../../startup/utilities';
import {NotificationService} from '../../../startup/services/notification.service';
import {UploadManager} from '../../../startup/services/upload.manager';

import './gallery.html';

import './components/share.button';
import './components/edit.button';
import './components/remove.button';
import './modals/photo.modal';

const templateName = "rea.albums.gallery";

Template[templateName].onCreated(function () {
    this.getAlbumId = () => FlowRouter.getParam("albumId");
    this.getPage = () => Math.max(FlowRouter.getParam("page") || 1, 1);
    this.getTotalPhotos = () => Counts.get('album.photos.count');
    this.getTotalPages = () => Math.ceil(this.getTotalPhotos() / this.limit.get());
    this.hasPreviousPage = () => this.getPage() <= 1;
    this.hasNextPage = () => this.getPage() >= this.getTotalPages();

    this.limit = new ReactiveVar(12);

    this.autorun(() => {
        this.subscribe('album', this.getAlbumId());
        this.subscribe('photos.album', this.getAlbumId(), this.getPage(), this.limit.get());
    });
});

Template[templateName].helpers({
    album() {
        return Albums.findOne(Template.instance().getAlbumId());
    },
    description() {
        return this.description || 'No description provided';
    },
    countPhotos() {
        return Template.instance().getTotalPhotos();
    },
    canManage() {
        return this.ownerId === Meteor.userId() || hasRole('ALBUM');
    },
    shareButtonData() {
        return {
            albumId: this._id,
            text: 'Share album'
        }
    },
    editButtonData() {
        return {
            albumId: this._id,
            text: 'Edit album'
        }
    },
    removeButtonData() {
        return {
            albumId: this._id,
            text: 'Remove album'
        }
    },
    hasPagination() {
        const template = Template.instance();

        return template.getTotalPhotos() > template.limit.get();
    },
    previousPageHref() {
        const template = Template.instance();
        return !template.hasPreviousPage() && FlowRouter.path('rea.albums.gallery.page', {albumId: template.getAlbumId(), page: template.getPage() - 1});
    },
    nextPageHref() {
        const template = Template.instance();
        return !template.hasNextPage() && FlowRouter.path('rea.albums.gallery.page', {albumId: template.getAlbumId(), page: template.getPage() + 1});
    },
    previousPageDisabled() {
        return Template.instance().hasPreviousPage() && 'is-disabled';
    },
    nextPageDisabled() {
        return Template.instance().hasNextPage() && 'is-disabled';
    },
    pages() {
        return _.range(1, Template.instance().getTotalPages() + 1);
    },
    currentPage(page) {
        return Template.instance().getPage() === page && 'is-current';
    },
    photoView() {
        return Session.get('photo.view');
    }
});

Template[templateName].events({
    'change #photos'(event, template) {
        const files = event.currentTarget.files;

        _.each(files, file => {
            file.id = Random.id();

            const uploader = Photos.insert({
                file: file,
                meta: {
                    albumId: template.getAlbumId()
                },
                streams: 'dynamic',
                chunkSize: 'dynamic'
            });

            // UploadManager.addFileInUploader(template.getAlbumId(), uploader);
        });
    },
    'click .js-remove-photo'(event) {
        event.preventDefault();

        if (confirm('Are you really sure you want to delete this photo ?')) {
            removePhoto.call({photoId: this._id}, error => {
                if (error) {
                    NotificationService.error(error.toString());
                }
            });
        }
    }
});