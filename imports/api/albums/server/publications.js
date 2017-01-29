import {Meteor} from "meteor/meteor";
import {Counts} from "meteor/tmeasday:publish-counts";

import {Albums} from "../albums";
import {Photos} from "../../photos/photos";
import {AlbumManager} from '../../../startup/services/album.manager';

Meteor.publishComposite('albums.user', (limit = 3) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return AlbumManager.findUserAlbums(this.userId, {}, {
                sort: {
                    createdAt: -1
                },
                limit
            });
        },
        children: [
            {
                find(album) {
                    return album.preview();
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

Meteor.publishComposite('albums.shared', (limit = 3) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return AlbumManager.findAlbumsSharedWithUser(this.userId, {}, {
                sort: {
                    createdAt: -1
                },
                limit
            });
        },
        children: [
            {
                find(album) {
                    return album.preview();
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

            Counts.publish(this, 'album.photos.count', Photos.collection.find({
                "meta.albumId": albumId,
                "meta.deletedAt": {
                    $exists: false
                }
            }));

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

Meteor.publishComposite('album.share', (albumId) => {
    return {
        find() {
            return Albums.find(albumId, {}, {
                fields: {
                    name: 1,
                    grantedUsersIds: 1
                }
            });
        }
    }
});

Meteor.publishComposite('my.albums.count', () => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            Counts.publish(this, 'my.albums.count', AlbumManager.findUserAlbums(this.userId));

            return this.ready();
        }
    }
});

Meteor.publishComposite('shared.albums.count', () => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            Counts.publish(this, 'shared.albums.count', AlbumManager.findAlbumsSharedWithUser(this.userId));

            return this.ready();
        }
    }
});