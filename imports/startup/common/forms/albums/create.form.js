import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const CreateAlbumForm = new SimpleSchema({
    title: {
        type: String,
        label: "Name your album",
        max: 60
    },
    description: {
        type: String,
        label: 'Description (optional)',
        max: 255,
        optional: true
    }
});