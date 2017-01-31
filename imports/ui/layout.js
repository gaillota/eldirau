import {Template} from 'meteor/templating';

import {UploadManager} from '../startup/services/upload.manager';

import './components/navbar.component';
import './components/loading.component';
import './components/uploader.component';

import './rea/albums/modals/albums.modal';
import './rea/albums/modals/share.modal';

import './layout.html';

Template.layout.helpers({
    uploads() {
        return UploadManager.getUploads();
    },
    modals() {
        return [
            'rea.albums.modals',
            'rea.albums.share.modal'
        ];
    }
});