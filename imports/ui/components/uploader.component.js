import {Template} from "meteor/templating";
import {ReactiveVar} from 'meteor/reactive-var';
import {Random} from 'meteor/random'

import './uploader.component.html';

const templateName = "uploader";

Template[templateName].onCreated(function () {
    this.hidden = new ReactiveVar(false);
});

Template[templateName].onRendered(function () {
    this.$('#photos').click();
});

Template[templateName].helpers({
    formId() {
        return Template.instance().formId;
    },
    hidden() {
        return Template.instance().hidden.get() && 'is-hidden';
    },
    reduceIcon() {
        return Template.instance().hidden.get() ? 'plus' : 'minus';
    }
});

Template[templateName].events({
    'click .reduce'(event, template) {
        event.preventDefault();

        template.hidden.set(!template.hidden.get());
    },
    'change #photos'(event, template) {
        const files = event.currentTarget.files;
    }
});