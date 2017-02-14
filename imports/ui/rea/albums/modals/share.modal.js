import {Meteor} from 'meteor/meteor';
import {Template} from "meteor/templating";
import {ReactiveDict} from 'meteor/reactive-dict';

import {Albums} from '../../../../api/albums/albums';
import {share} from '../../../../api/albums/methods';
import {getModalData, toggleModal} from '../../../../startup/utilities';

import './share.modal.html';

const templateName = "rea.albums.share.modal";

Template[templateName].onCreated(function() {
    this.getAlbumId = () => getModalData('album.share');
    this.search = () => this.state.set('search', this.state.get('keywords'));
    this.state = new ReactiveDict();

    this.autorun(() => {
        this.subscribe('album.share', this.getAlbumId());
        this.subscribe('users.search', this.state.get('search'));
    });

    this.autorun(() => {
        const album = Albums.findOne(this.getAlbumId());
        this.state.set('grantedUsersIds', album && album.grantedUsersIds || []);
    });
});

Template[templateName].helpers({
    isActive() {
        return getModalData('album.share') && 'is-active';
    },
    album() {
        return Albums.findOne(Template.instance().getAlbumId());
    },
    users() {
        return Meteor.users.find({
            _id: {
                $ne: Meteor.userId()
            }
        });
    },
    checked() {
        return Template.instance().state.get('grantedUsersIds').indexOf(this._id) >= 0 && 'checked';
    }
});

Template[templateName].events({
    'keyup .js-search-input'(event, template) {
        const keywords = event.currentTarget.value.trim();

        template.state.set('keywords', keywords);
    },
    'click .js-search'(event, template) {
        event.preventDefault();

        template.search();
    },
    'click .js-toggle-share'(event, template) {
        event.preventDefault();

        let grantedUsersIds = template.state.get('grantedUsersIds');

        if (grantedUsersIds.indexOf(this._id) >= 0) {
            grantedUsersIds = grantedUsersIds.filter(userId => userId !== this._id);
        } else {
            grantedUsersIds.push(this._id);
        }

        template.state.set('grantedUsersIds', grantedUsersIds);
    },
    'click .js-save'(event, template) {
        event.preventDefault();

        share.call({albumId: template.getAlbumId(), usersIds: template.state.get('grantedUsersIds')}, error => {
            if (error) {
                NotificationService.error(error.toString());
            }

            toggleModal('album.share', undefined);
        });
    },
    'click .js-hide-modal'(event) {
        event.preventDefault();

        toggleModal('album.share', undefined);
    }
});
