import {Meteor} from 'meteor/meteor';

import {Photos} from '../photos';

Meteor.publishComposite('album.photos', (albumId, limit = 20) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return Photos.find({
                albumId
            }, {
                limit
            }).cursor;
        }
    }
});

Meteor.publishComposite('photo', (photoId) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return Photos.find(photoId);
        }
    }
});