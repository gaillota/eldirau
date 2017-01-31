import {Template} from "meteor/templating";

import {remove} from '../../../../api/albums/methods';

import './remove.button.html';

const templateName = "rea.albums.remove.button";

Template[templateName].helpers({
    text() {
        return Template.currentData().text || 'Remove';
    }
});

Template[templateName].events({
    'click .js-remove-album'() {
        const props = Template.currentData();
        if (props.albumId) {
            if (confirm('Are you really sure you want to delete the entire album ?')) {
                remove.call({albumId: props.albumId}, error => {
                    if (error) {
                        NotificationService.error(error.toString());
                        return;
                    }

                    FlowRouter.go(props.redirectTo || 'rea.index');
                });
            }
        }
    }
});