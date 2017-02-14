import {Template} from "meteor/templating";
import {ReactiveDict} from "meteor/reactive-dict";
import {FlowRouter} from "meteor/kadira:flow-router";
import {Counts} from "meteor/tmeasday:publish-counts";
import {_} from "lodash";
import {Random} from 'meteor/random';

import {Albums} from "../../../api/albums/albums";
import {Photos} from '../../../api/photos/photos';
import {remove as removePhoto} from '../../../api/photos/methods';
import {hasRole} from '../../../startup/utilities';
import {NotificationService} from '../../../startup/services';

import './gallery.html';

import './components/share.button';
import './components/edit.button';
import './components/remove.button';
import './modals/slider.modal';

const templateName = "rea.albums.gallery";

Template[templateName].onCreated(function () {
    this.getAlbumId = () => FlowRouter.getParam("albumId");
    this.getPage = () => Math.max(FlowRouter.getParam("page") || 1, 1);
    this.getTotalPhotos = () => Counts.get('album.photos.count');
    this.getTotalPages = () => Math.ceil(this.getTotalPhotos() / this.state.get('limit'));
    this.hasPreviousPage = () => this.getPage() > 1;
    this.hasNextPage = () => this.getPage() < this.getTotalPages();
    this.getPagePath = (page) => FlowRouter.path('rea.albums.gallery.page', {
        albumId: this.getAlbumId(),
        page: page
    });
    this.upload = () => {
        const template = this;
        const file = template.stack.shift();
        const currentFile = template.currentFile.get();

        if (file && (!currentFile || currentFile.state.get() == 'completed')) {
            Photos.insert({
                file: file,
                meta: {
                    albumId: template.getAlbumId()
                },
                streams: 'dynamic',
                chunkSize: 'dynamic',
                onStart: function () {
                    template.state.set('currentUpload', template.state.get('currentUpload') + 1);
                    template.currentFile.set(this);
                },
                onError: function (error, file) {
                    NotificationService.error(`Error while uploading ${file.name}: ${error}`);
                    template.currentFile.set(false);
                }
            }).on('end', function (error, file) {
                if (error) {
                    NotificationService.error(`Error while uploading ${file.name}: ${error}`);
                }

                template.currentFile.set(false);
                template.upload();
            });
        }
    };

    this.state = new ReactiveDict();
    this.state.set('limit', 12);
    this.state.set('currentUpload', 0);
    this.state.set('totalUploads', 0);

    // Forced to use a Reactive Var, RangeError on *state* otherwise
    this.currentFile = new ReactiveVar(false);

    this.stack = [];

    this.autorun(() => {
        this.subscribe('album', this.getAlbumId());
        this.subscribe('photos.album', this.getAlbumId(), this.getPage(), this.state.get('limit'));
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
    uploading() {
        return Template.instance().currentFile.get();
    },
    progress() {
        return this.progress.get()
    },
    done() {
        return this.state.get() == 'completed';
    },
    currentUpload() {
        return Template.instance().state.get('currentUpload');
    },
    totalUploads() {
        return Template.instance().state.get('totalUploads');
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

        return template.getTotalPhotos() > template.state.get('limit');
    },
    previousPageHref() {
        const template = Template.instance();
        return template.hasPreviousPage() && template.getPagePath(template.getPage() - 1);
    },
    nextPageHref() {
        const template = Template.instance();
        return template.hasNextPage() && template.getPagePath(template.getPage() + 1);
    },
    previousPageDisabled() {
        return !Template.instance().hasPreviousPage() && 'is-disabled';
    },
    nextPageDisabled() {
        return !Template.instance().hasNextPage() && 'is-disabled';
    },
    pages() {
        return _.range(1, Template.instance().getTotalPages() + 1);
    },
    currentPage(page) {
        return Template.instance().getPage() === page && 'is-current';
    },
    likesCount() {
        const likes = this.meta.likes || [];

        return likes.length;
    },
    commentsCount() {
        const comments = this.meta.comments || [];

        return comments.length;
    }
});

Template[templateName].events({
    'change #photos'(event, template) {
        // Get files selected
        const files = event.currentTarget.files;

        _.each(files, file => {
            // Add file to the stack
            template.stack.push(file);

            // Update total files count
            template.state.set('totalUploads', template.state.get('totalUploads') + 1);
        });

        // Start the upload
        template.upload();
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
