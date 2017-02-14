import {Template} from "meteor/templating";
import {ReactiveVar} from 'meteor/reactive-var';

import {AlbumRepository} from '../../../../startup/repositories';

import './my-albums.html';

import '../components/card.component';

const templateName = "rea.albums.section.my-albums";

Template[templateName].onCreated(function() {
    this.limit = new ReactiveVar(Template.currentData().limit || 0);

    this.autorun(() => {
        this.subscribe('albums.user', this.limit.get());
    });
});

Template[templateName].helpers({
    albums() {
        return AlbumRepository.findAlbumsByUser(Meteor.userId(), {}, {
            sort: {
                createdAt: -1
            },
            limit: Template.instance().limit.get()
        });
    }
});
