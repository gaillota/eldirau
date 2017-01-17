import {Gravatar} from 'meteor/jparker:gravatar';

export default GravatarService = {
    getUrl(email, size = 200) {
        return Gravatar.imageUrl(email, {
            size: size,
            default: 'wavatar'
        });
    }
};