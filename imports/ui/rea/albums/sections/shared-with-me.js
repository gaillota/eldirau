import {Template} from "meteor/templating";
import {ReactiveVar} from 'meteor/reactive-var';

import {AlbumRepository} from '../../../../startup/repositories';

import './shared-with-me.html';

import '../components/card.component';

const templateName = "rea.albums.section.shared-with-me";

Template[templateName].onCreated(function() {
    this.limit = new ReactiveVar(Template.currentData().limit || 0);

    this.autorun(() => {
        this.subscribe('albums.shared', this.limit.get());
    });
});

Template[templateName].helpers({
    albums() {
        return AlbumRepository.findAlbumsSharedWithUser(Meteor.userId(), {}, {
            sort: {
                createdAt: -1
            },
            limit: Template.instance().limit.get()
        });
    }
});
