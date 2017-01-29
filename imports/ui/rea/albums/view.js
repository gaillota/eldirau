import {Template} from "meteor/templating";
import {Session} from 'meteor/session';
import {ReactiveVar} from "meteor/reactive-var";
import {ReactiveDict} from "meteor/reactive-dict";
import {FlowRouter} from "meteor/kadira:flow-router";
import {Counts} from "meteor/tmeasday:publish-counts";
import {_} from "lodash";

import {Albums} from "../../../api/albums/albums";
import {remove} from '../../../api/albums/methods';
import {Photos} from '../../../api/photos/photos';
import {toggleModal, hasRole} from '../../../startup/utilities';
import {NotificationService} from '../../../startup/services/notification.service';

import './view.html';

import './modals/photo.modal';

const templateName = "rea.albums.view";

Template[templateName].onCreated(function () {
    this.getAlbumId = () => FlowRouter.getParam("albumId");
    this.limit = new ReactiveVar(10);

    this.autorun(() => {
        this.subscribe('album', this.getAlbumId());
        this.subscribe('photos.album', this.getAlbumId(), this.limit.get());
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
        return Counts.get('album.photos.count');
    },
    canManage() {
        return this.ownerId === Meteor.userId() || hasRole('ALBUM');
    },
    photoView() {
        return Session.get('photo.view');
    }
});

Template[templateName].events({
    'change #photos'(event, template) {
        const files = event.currentTarget.files;

        _.each(files, file => {
            // const tempName = 'file' + template.currentFileId++;

            Photos.insert({
                file: file,
                meta: {
                    albumId: template.getAlbumId()
                },
                streams: 'dynamic',
                chunkSize: 'dynamic'
            }, false)
                .on('start', () => {
                    // console.log('upload started for', tempName);
                    // const pendingFiles = template.pendingFiles.get();
                    // pendingFiles[tempName] = this;
                    // console.log(pendingFiles);
                    // template.pendingFiles.set(pendingFiles);
                })
                .on('end', () => {
                    // console.log('upload ended for', tempName);
                    // const pendingFiles = template.pendingFiles.get();
                    // pendingFiles.filter((file, name) => name !== tempName);
                    // template.pendingFiles.set(pendingFiles);
                })
                .on('uploaded', (error, fileObj) => {
                    // console.log('uploaded', tempName);
                    if (error) {
                        console.error(error.toString());
                    }
                })
                .on('error', (error, fileObj) => {
                    NotificationService.error(error.toString());
                }).start();
        });
    },
    'click .js-share-album'(event) {
        event.preventDefault();

        toggleModal('album.share', this._id);
    },
    'click .js-edit-album'(event, template) {
        event.preventDefault();

        toggleModal('album.modal', template.getAlbumId());
    },
    'click .js-remove-album'(event, template) {
        event.preventDefault();

        if (confirm('Are you really sure you want to delete the entire album ?')) {
            remove.call({albumId: template.getAlbumId()}, error => {
                if (error) {
                    NotificationService.error(error.toString());
                    return;
                }

                FlowRouter.go('rea.index');
            });
        }
    }
});