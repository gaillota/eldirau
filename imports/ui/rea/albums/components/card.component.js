import {Template} from "meteor/templating";

import './card.component.html';

import './share.button';
import './edit.button';

const templateName = "rea.albums.card";

Template[templateName].helpers({
    shareButtonData() {
        return {
            type: 'info',
            classes: 'is-small',
            albumId: this._id
        }
    },
    editButtonData() {
        return {
            type: 'warning',
            classes: 'is-small',
            albumId: this._id
        }
    }
});
