import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactiveDict} from 'meteor/reactive-dict';

import NotificationService from '../../startup/services';
import {toggleModal} from '../../startup/utilities'

import './navbar.component.html';

import './logo.component';

Template.navbar.onCreated(function onCreatedFunction() {
    this.state = new ReactiveDict();
    this.state.set('active', false);
});

Template.navbar.helpers({
    active() {
        return Template.instance().state.get('active') && 'is-active';
    }
});

Template.navbar.events({
    'click #nav-toggle'(event, instance) {
        event.preventDefault();

        instance.state.set('active', !instance.state.get('active'));
    },
    'click .js-create-album'(event) {
        event.preventDefault();

        toggleModal('album.modal', true);
    },
    'click .js-logout'(event) {
        event.preventDefault();

        Meteor.logout(function (error) {
            if (error) {
                NotificationService.error(error.toString());
            } else {
                FlowRouter.go('public.auth.login');
            }
        });
    }
});