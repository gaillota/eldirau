import {Template} from "meteor/templating";

import './card.component.html';

import './share.button';
import './edit.button';

const templateName = "rea.albums.card";

Template[templateName].helpers({
    preview() {
        return this.preview().count() && this.preview(true)[0];
    },
    shareButtonData() {
        return {
            type: 'light',
            classes: 'is-small is-fullwidth',
            albumId: this._id
        }
    },
    editButtonData() {
        return {
            type: 'light',
            classes: 'is-small is-fullwidth',
            albumId: this._id
        }
    },
    removeButtonData() {
        return {
            type: 'light',
            classes: 'is-small is-fullwidth',
            albumId: this._id
        }
    }
});
