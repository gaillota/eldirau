import {Session} from 'meteor/session';
import {_} from 'lodash';

/**
 * Upload Manager
 *
 * Manage a Session variable which contains an array of object.
 * Each of which has 2 property: the *albumId* and an array *fileUploaders*
 */
export const UploadManager = {
    addFileInUploader(albumId, fileUploader) {
        const albumsIds = this.getUploads();
        const uploads = this.getCurrentUploadsFor(albumId);

        if (albumsIds.indexOf(albumId) < 0) {
            this.addInUploads(albumId);
        }

        uploads.push(fileUploader);

        this.setCurrentUploadsFor(albumId, uploads);
    },
    removeUploaderFor(albumId, andSet) {
        const uploads = this.getCurrentUploads().filter(u => u.albumId !== albumId);
        if (andSet) {
            this.setCurrentUploads(uploads);
        }

        return uploads;
    },
    setCurrentUploadsFor(albumId, uploads) {
        Session.set('upload-' + albumId, uploads);
    },
    getCurrentUploadsFor(albumId) {
        return Session.get('upload-' + albumId) || [];
    },
    addInUploads(albumId) {
        const albumIds = this.getUploads();
        albumIds.push(albumId);
        Session.set('uploads.albums', albumIds);
    },
    removeInUploads(albumId) {
        const albumIds = this.getUploads();
        const index = albumIds.indexOf(albumId);
        if (index < 0) {
            return;
        }

        Session.set('uploads.albums', albumIds.splice(index, 1));
    },
    getUploads() {
        return Session.get('uploads.albums') || [];
    }
};