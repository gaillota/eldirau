import {Template} from "meteor/templating";

import './card.component.html';

import './share.button';
import './edit.button';

const templateName = "rea.albums.card";

Template[templateName].helpers({
    shareButtonData() {
        return {
            classes: 'is-small',
            albumId: this._id
        }
    },
    editButtonData() {
        return {
            classes: 'is-small',
            albumId: this._id
        }
    }
});