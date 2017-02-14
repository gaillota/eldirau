import {Template} from "meteor/templating";
import {ReactiveVar} from 'meteor/reactive-var';

import {UploadManager} from '../../startup/client/services/upload.manager';

import './uploader.component.html';

const templateName = "uploader";

Template[templateName].onCreated(function () {
    this.minimized = new ReactiveVar(false);
});

Template[templateName].helpers({
    totalCount() {
        return UploadManager.getTotalCount();
    },
    minimized() {
        return Template.instance().minimized.get() && 'is-hidden';
    },
    minimizeIcon() {
        return Template.instance().minimized.get() ? 'plus' : 'minus';
    },
    currentUpload() {
        return UploadManager.getCurrentUpload()
    },
    pendingUploads() {
        return UploadManager.getPendingUpload();
    },
    progress() {
        // Reactive var is broken bro !
        this.progress.get();
    },
    done() {
        return this.state === 'completed';
    }
});

Template[templateName].events({
    'click .reduce'(event, template) {
        event.preventDefault();

        template.minimized.set(!template.minimized.get());
    }
});
