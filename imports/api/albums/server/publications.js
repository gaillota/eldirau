import {Meteor} from "meteor/meteor";
import {Counts} from "meteor/tmeasday:publish-counts";

import {Albums} from "../albums";
import {Photos} from "../../photos/photos";

Meteor.publishComposite('albums.index', (limit = 5) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return Albums.find({}, {
                sort: {
                    createdAt: -1
                },
                limit
            });
        },
        children: [
            {
                find(album) {
                    return Photos.find({
                        albumId: album._id
                    }, {
                        sort: {
                            updatedAt: -1
                        },
                        limit: 1
                    }).cursor;
                }
            },
            {
                find(album) {
                    return Meteor.users.find(album.ownerId);
                }
            }
        ]
    }
});

Meteor.publishComposite('album', (albumId) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            Counts.publish(this, 'album.photos.count', Photos.find({
                "meta.albumId": albumId
            }).cursor);

            return Albums.find(albumId);
        },
        children: [
            {
                find(album) {
                    return Meteor.users.find(album.ownerId);
                }
            }
        ]
    }
});