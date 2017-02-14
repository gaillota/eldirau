import {Session} from 'meteor/session';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ReactiveVar} from 'meteor/reactive-var';
import {Random} from 'meteor/random'

import {Photos} from '../../../api/photos/photos';
import {NotificationService} from '../../services';

export const UploadManager = (function () {
    // Session labels
    const Labels = {
        CURRENT_UPLOAD: 'upload.current',
        PENDING_UPLOADS: 'upload.pending',
        DONE_UPLOAD_COUNT: 'upload.done.count',
        TOTAL_UPLOAD_COUNT: 'upload.total.count',
        MULTIPLE: 'upload.multiple',
    };
    // File stack
    let stack = stack || [];
    const currentUpload = new ReactiveVar(false);
    const showUploader = new ReactiveVar(false);
    const schema = new SimpleSchema({file: {type: File}, albumId: {type: String, regEx: SimpleSchema.RegEx.Id}});

    const getCurrentUpload = () => currentUpload.get();
    const setCurrentUpload = (file) => currentUpload.set(file);
    /**
     * Pending files
     * Session var only used for UX purpose
     */
    const getPendingUploads = () => Session.get(Labels.PENDING_UPLOADS) || [];
    const setPendingUploads = (uploads) => Session.set(Labels.PENDING_UPLOADS, uploads);
    const addPendingUpload = (photo) => {
        const data = getPendingUploads();
        data.push({
            id: photo.id,
            filename: photo.file.name
        });
        setPendingUploads(data);
    };
    const removePendingUpload = id => id ? setPendingUploads(getPendingUploads().filter(p => p.id !== id)) : setPendingUploads(getPendingUploads().shift());
    /**
     * Total file count
     */
    const getTotalCount = () => Session.get(Labels.TOTAL_UPLOAD_COUNT) || 0;
    const incrementTotalCounter = () => Session.set(Labels.TOTAL_UPLOAD_COUNT, getTotalCount() + 1);
    /**
     * Multi-upload mode
     */
    const isMultiple = () => Session.get(Labels.MULTIPLE) || !1;
    const toggleMultiple = () => Session.set(Labels.MULTIPLE, !isMultiple());
    const addPhotoToStack = (photo) => stack.push(photo);
    const getNextPhoto = () => stack.shift();
    const isUploaderVisible = () => showUploader.get() || !1;
    const toggleUploader = () => showUploader.set(!isUploaderVisible());

    // External functions

    const upload = () => {
        const photo = getNextPhoto();
        const currentUpload = getCurrentUpload();

        // No photo left to upload || upload is already active
        if (!photo || (currentUpload && currentUpload.state !== 'completed')) {
            console.log('no photo left or current upload not done yet');
            return;
        }

        const uploader = Photos.insert({
            file: photo.file,
            meta: {
                albumId: photo.albumId
            },
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);

        uploader.on('start', function () {
            removePendingUpload(photo.id);
            setCurrentUpload(this);
        });

        uploader.on('error', function (error, file) {
            NotificationService.error(`Error while uploading ${file.name}: ${error}`);
        });

        uploader.on('end', function (error, file) {
            if (error) {
                NotificationService.error(`Error while uploading ${file.name}: ${error}`);
            }

            upload();
        });

        uploader.start();
    };

    const addPhotoToQueue = (photo, start) => {
        schema.validate(photo);
        photo.id = Random.id();
        addPhotoToStack(photo);
        addPendingUpload(photo);
        incrementTotalCounter();
        if (!isUploaderVisible()) {
            toggleUploader();
        }
        if (start) {
            upload();
        }
    };

    return {
        addPhotoToQueue: addPhotoToQueue,
        getCurrentUpload: getCurrentUpload,
        getPendingUpload: getPendingUploads,
        getTotalCount: getTotalCount,
        showUploader: isUploaderVisible,
        start: upload,
    }
})();
