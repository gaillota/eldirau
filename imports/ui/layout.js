import {Template} from 'meteor/templating';

import './components/navbar.component';
import './components/loading.component';
import './rea/albums/modals/albums.modal';

import './layout.html';

Template["layout"].helpers({
    modals() {
        return [
            'rea.albums.modals'
        ];
    }
});