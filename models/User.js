var keystone = require('keystone'),
    Types = keystone.Field.Types

var User = new keystone.List('User');

User.add({
  name: { type: Types.Name, required: true },
  email: { type: Types.Email, initial: true, required: true },
  password: { type: Types.Password, initial: true, required: true },
  canAccessKeystone: { type: Boolean, initial: true }
})

User.register();
