import {ValidatedMethod} from 'meteor/mdg:validated-method';

import {Photos} from './photos';

export const update = new ValidatedMethod({
    name: 'photo.update',
    mixins: [ValidatedMethod.mixins.isLoggedIn, ValidatedMethod.mixins.checkSchema],
    schema: {
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        title: {
            type: String
        }
    },
    run({photoId, title}) {
        const photo = Photos.find({
            _id: photoId,
            userId: this.userId
        });

        if (!photo.cursor.count()) {
            return "This photo either not exists or is not yours";
        }

        return Photos.update(photoId, {
            $set: {
                title: title
            }
        });
    }
});

export const remove = new ValidatedMethod({
    name: 'photo.remove',
    mixins: [ValidatedMethod.mixins.isLoggedIn, ValidatedMethod.mixins.checkSchema],
    schema: {
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
    },
    run({photoId}) {
        const photo = Photos.find({
            _id: photoId,
            userId: this.userId
        });

        if (!photo.cursor.count()) {
            return "This photo either not exists or is not yours";
        }

        return Photos.remove(photoId);
    }
});