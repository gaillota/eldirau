import {Meteor} from "meteor/meteor";
import {Counts} from "meteor/tmeasday:publish-counts";

import {Albums} from "../albums";
import {Photos} from "../../photos/photos";
import {AlbumRepository} from '../../../startup/repositories';

Meteor.publishComposite('albums.user', (limit = 3) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return AlbumRepository.findAlbumsByUser(this.userId, {}, {
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

            return AlbumRepository.findAlbumsSharedWithUser(this.userId, {}, {
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

            const album = Albums.find(albumId);

            if (!album.count()) {
                throw new Meteor.Error("not-found", 'Photo not found');
            }

            if (!album.fetch()[0].hasAccess(this.userId)) {
                throw new Meteor.Error("not-authorized", "You are not allowed to see this photo");
            }

            Counts.publish(this, 'album.photos.count', Photos.collection.find({
                "meta.albumId": albumId,
                "meta.deletedAt": {
                    $exists: false
                }
            }));

            return album;
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

/**
 * Counts
 */

Meteor.publishComposite('my.albums.count', () => {
    return {
        find() {
            if (this.userId) {
                Counts.publish(this, 'my.albums.count', AlbumRepository.findAlbumsByUser(this.userId));
            }

            return this.ready();
        }
    }
});

Meteor.publishComposite('shared.albums.count', () => {
    return {
        find() {
            if (this.userId) {
                Counts.publish(this, 'shared.albums.count', AlbumRepository.findAlbumsSharedWithUser(this.userId));
            }

            return this.ready();
        }
    }
});

Meteor.publish('albums.admin.count', function () {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'ADMIN')) {
        return this.ready();
    }

    Counts.publish(this, 'albums.admin.count', Albums.find({
        deletedAt: {
            $exists: false
        }
    }));

    return this.ready();
});
