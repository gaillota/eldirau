import {Template} from 'meteor/templating';

import {Albums} from '../../api/albums/albums';

import './index.html';

const templateName = "rea.index";

Template[templateName].helpers({
    lastAlbums() {
        Albums.find({}, {
            sort: {
                createAt: -1
            }
        });
    }
});