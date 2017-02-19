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
    this.getTotalPhotos = () => Counts.get('album.photos.count');
    this.getPage = () => this.state.get('page');
    this.getLimit = () => this.state.get('limit');
    this.getPages = () => Math.ceil(this.getTotalPhotos() / this.getLimit());
    this.hasPreviousPage = () => this.getPage() > 1;
    this.hasNextPage = () => this.getPage() < this.getPages();
    this.goTo = (page) => page > 0 && page < this.getPages() + 1 ? this.state.set('page', page) : '';
    // this.getPagePath = (page) => FlowRouter.path('rea.albums.gallery.page', {
    //     albumId: this.getAlbumId(),
    //     page: page
    // });
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
    this.state.set('page', 1);
    this.state.set('limit', 12);
    this.state.set('currentUpload', 0);
    this.state.set('totalUploads', 0);

    // Forced to use a separated Reactive Var, RangeError on *state* otherwise
    this.currentFile = new ReactiveVar(false);

    this.stack = [];

    this.autorun(() => {
        this.subscribe('album', this.getAlbumId());
        this.subscribe('photos.album', this.getAlbumId(), this.getPage(), this.getLimit());
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
    pagination() {
        const template = Template.instance();

        return template.getTotalPhotos() > template.getLimit();
    },
    previousPageDisabled() {
        return !Template.instance().hasPreviousPage() && 'is-disabled';
    },
    nextPageDisabled() {
        return !Template.instance().hasNextPage() && 'is-disabled';
    },
    pages() {
        return _.range(Template.instance().getPages()).map(p => ({page: p + 1}));
    },
    currentPage() {
        return Template.instance().getPage() === this.page && 'is-current';
    },
    likesCount() {
        const likes = this.meta.likes || [];

        return likes.length;
    },
    commentsCount() {
        return this.meta.commentsCount;
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
    },
    'click .js-previous-page'(event, template) {
        event.preventDefault();

        template.goTo(template.getPage() - 1);
    },
    'click .js-next-page'(event, template) {
        event.preventDefault();

        template.goTo(template.getPage() + 1);
    },
    'click .pagination-link'(event, template) {
        event.preventDefault();

        template.goTo(this.page);
    }
});
