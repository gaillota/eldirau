import {Template} from 'meteor/templating';

import {UploadManager} from '../startup/client/services/upload.manager';

import './components/navbar.component';
import './components/loading.component';
import './components/uploader.component';

// Modals templates
import './rea/albums/modals/albums.modal';
import './rea/albums/modals/share.modal';

import './layout.html';

Template.layout.helpers({
    showUploader() {
        return UploadManager.showUploader();
    },
    modals() {
        return [
            'rea.albums.modals',
            'rea.albums.share.modal'
        ];
    }
});
