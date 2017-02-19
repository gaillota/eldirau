import {Gravatar} from 'meteor/jparker:gravatar';

export const GravatarService = {
    getUrl(email, size = 200) {
        return Gravatar.imageUrl(email, {
            secure: true,
            size: size,
            default: 'wavatar'
        });
    }
};
