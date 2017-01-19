import {Template} from 'meteor/templating';

import {Albums} from '../../api/albums/albums';

import './index.html';

const templateName = "rea.index";

Template[templateName].onCreated(function () {
    this.subscribe('albums.index');
});

Template[templateName].helpers({
    albums() {
        return Albums.find({}, {
            sort: {
                createAt: -1
            }
        });
    }
});