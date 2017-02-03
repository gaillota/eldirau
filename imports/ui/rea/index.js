import {Template} from 'meteor/templating';

import './index.html';

import '../components/sidemenu.component';
import './albums/sections/my-albums';
import './albums/sections/shared-with-me';

const templateName = "rea.index";

Template[templateName].helpers({
    indexData() {
        return {
            limit: 3
        };
    },
});
