import {Template} from "meteor/templating";

import {LoginForm} from '../../../startup/common/forms/auth/_login.form';

import './login.html';

const templateName = "public.auth.login";

Template[templateName].helpers({
    loginForm() {
        return LoginForm;
    }
});