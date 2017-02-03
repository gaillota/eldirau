import {Template} from "meteor/templating";
import {ReactiveVar} from 'meteor/reactive-var';

import {UploadManager} from '../../startup/services';

import './uploader.component.html';

const templateName = "uploader";

Template[templateName].onCreated(function () {
    this.hidden = new ReactiveVar(false);
});

Template[templateName].helpers({
    uploadCount() {
        return UploadManager.getUploadCount();
    },
    filesCount() {
        return UploadManager.getFilesCount();
    },
    hidden() {
        return Template.instance().hidden.get() && 'is-hidden';
    },
    reduceIcon() {
        return Template.instance().hidden.get() ? 'plus' : 'minus';
    },
    currentFile() {
        return UploadManager.getCurrentFile();
    }
});

Template[templateName].events({
    'click .reduce'(event, template) {
        event.preventDefault();

        template.hidden.set(!template.hidden.get());
    }
});
