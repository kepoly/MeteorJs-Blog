/**
 * Created by kepoly on 4/20/2016.
 */

import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});