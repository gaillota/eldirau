import {Session} from 'meteor/session';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Photos} from '../../../api/photos/photos';
import {NotificationService} from '../../services';

export const UploadManager = (function () {
    const storeName = 'Photos.stack';
    const labels = {
        currentFile: 'upload.current',
        filesCount: 'upload.total.count',
        uploadCount: 'upload.uploaded.count',
        multiple: 'upload.multiple'
    };

    const _init = () => {
        localStorage.setItem(storeName, []);
        Session.setDefault(labels.uploadCount, 0);
        Session.setDefault(labels.filesCount, 0);
        Session.setDefault(labels.multiple, false);
    };

    const _upload = () => {
        const stack = getStack();
        const photo = stack.shift();
        const currentFile = getCurrentFile();

        if (!photo) {
            // No more photo to upload
            return;
        }

        if (currentFile && currentFile.state.get !== 'completed' && !Session.get(labels.multiple)) {
            // An upload is running and multi-upload is disabled
            return;
        }

        Photos.insert({
            file: photo.file,
            meta: {
                albumId: photo.albumId
            },
            streams: 'dynamic',
            chunkSize: 'dynamic',
            onStart: function () {
                Session.set(labels.uploadCount, Session.get(labels.uploadCount) + 1);
                setCurrentFile(this);
            },
            onError: function (error, file) {
                NotificationService.error(`Error while uploading ${file.name}: ${error}`);
            }
        }).on('end', function (error, file) {
            if (error) {
                NotificationService.error(`Error while uploading ${file.name}: ${error}`);
            }

            // Waiting
            _upload();
        });
    };

    const start = () => _upload();

    const addFileToQueue = (photo, start) => {
        new SimpleSchema({
            file: {
                type: File,
                blackbox: true
            },
            albumId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id
            }
        }).validate(photo);

        addFileToStack(photo);
        Session.set(labels.filesCount, Session.get(labels.filesCount) + 1);

        if (start) {
            _upload();
        }
    };

    const addFileToStack = (file) => {
        const stack = getStack();

        stack.push(file);
        setStack(stack);
    };
    const getStack = () => JSON.parse(localStorage.getItem(storeName));
    const setStack = (stack) => localStorage.setItem(storeName, JSON.stringify(stack));
    const getCurrentFile = () => Session.get(labels.currentFile);
    const setCurrentFile = (file) => Session.set(labels.currentFile, file);
    const getUploadCount = () => Session.get(labels.uploadCount);
    const getFilesCount = () => Session.get(labels.filesCount);

    _init();

    return {
        start: start,
        addFileToQueue: addFileToQueue,
        getCurrentFile: getCurrentFile,
        getUploadCount: getUploadCount,
        getFilesCount: getFilesCount
    }
})();
