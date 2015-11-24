# Keystone.js
Demo for General Assembly WDI.

## Documentation
http://keystonejs.com/docs/

## Introduction

1. Give brief explanation on CMS, WordPress, ActiveAdmin, etc. King & Partners example.

## Instructions

1. Talk about Yeoman generator. Aren't going to use it.
2. Touch a server.js file.
3. Run NPM init.
4. Install dependencies.
  - keystone
  - express-handlebars

### Server.js
5. `server.js` file:
  - additional setup explanation can be found: http://keystonejs.com/docs/configuration/


```javascript
var keystone = require('keystone');
var handlebars = require('express-handlebars')

keystone.init({

  'name': 'ga_keystone',

  'favicon': 'public/favicon.ico',
  'static': 'public',

  'views': 'templates/views',
  'view engine': 'hbs',

  'custom engine': handlebars.create({
    layoutsDir: 'templates/layouts',
    defaultLayout: 'default',
    extname: '.hbs'
  }).engine,

  'auto update': true,
  'mongo': 'mongodb://localhost/ga_keystone',

  'session': true,
  'auth': true,
  'user model': 'User',
  'cookie secret': 'youcanthavethecrabstillyoufinishthelab'

});

require('./models');

keystone.set('routes', require('./routes'));
keystone.start();
```

### Project Structure
6. Set up project structure.

```
- models
- node_modules
- public
- routes
    - views
- templates
    - views
    - layouts
- updates

  package.json
  server.js
```


### First Model, `User.js`
7. First model, a `user`. Create an index.js inside your `models` folder. This is where we'll be requiring all our models.

*models/index.js*
```javascript
require('./User.js');
```

*models/User.js*

```javascript
var keystone = require('keystone');
    Types = keystone.Field.Types;

// reference documentation to discuss Field Types

var User = new keystone.List('User');
// var User = mongoose.model("User", userSchema);

User.add({
  name: { type: Types.Name, required: true },
  email: { type: Types.Email, initial: true, required: true},
  password: { type: Types.Password, initial: true, required: true },
  canAccessKeystone: { type: Boolean, initial: true }
});

User.register();

```

### Routes & Controllers

8. Setting up routes / controllers. Create an index.js inside your routes folder. Reference documentation to explain route binding.

*routes/index.js*

```javascript
var keystone = require('keystone');
    importRoutes = keystone.importer(__dirname);

// Load Routes
var routes = {
    views: importRoutes('./views')
};

// Bind Routes
exports = module.exports = function(app) {

    app.get('/', routes.views.index);

};

```

9. Lets create a controller for our main view.

*routes/views/index.js*

```javascript
var keystone = require('keystone');
const async = require('async');

exports = module.exports = function(req, res){
  var view = new keystone.View(req , res);

  view.render('index');
};
```

### Templates / Views

10. Lets create our first layout, inside `templates/views/layouts` called `default.hbs`. This references the "default" we set in our server.js.

*templates/layouts/default.hbs*
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
    <title>KEYSTONE</title>
  </head>
  <body>
    <div class="container">
    {{{body}}}
    <a href="/keystone">Admin</a>
    </div>
  </body>
</html>

```
11. Next we'll set up an actual view for the main index of our site. In `templates/views` called `index.hbs`.

*templates/views/index.hbs*
```html
<h1> Hello, there. I sure hope this works </h1>
```

### Break

<hr>

### Updates to create first `User`.

12. Create a file called `0.0.1-admin.js` inside your updates folder.

*updates/0.0.1-admin.js*

```javascript
var keystone = require('keystone'),
    User = keystone.list('User');

exports = module.exports = function(done) {

    new User.model({
        name: { first: 'Greg', last: 'Dunn' },
        email: 'grdunn@foo.bar',
        password: 'password',
        canAccessKeystone: true
    }).save(done);

};
```

13. Log into keystone as grdunn@foo.bar. Show admin ui. Create a new user, change password. Filter search results. Delete new user. Pull up Mongo client, show password encryption automatically.

### Create `Post` model.

14. Create `Post.js` inside models folder.

*models/Post.js*

```javascript
var keystone = require('keystone');
    Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
    autokey: { path: 'slug', from: 'title', unique: true },
    map: { name: 'title' },
    defaultSort: '-createdAt'
});

Post.add({
    title: { type: String, required: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
    author: { type: Types.Relationship, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    publishedAt: Date,
    content: { type: Types.Html, wysiwyg: true, height: 400 },
});

Post.register();
```

15. Don't forget to require the new `Post.js` model inside the models/index.js.

*models/index.js*

```javascript
require('./User.js');
require('./Post.js');
```

16. Log back into application as grdunn@foo.bar, show Admin UI with `Post` model creatable. Create a few new posts, with different states.

### Flesh out Index routes controller to fetch DB data to the view.

17. We'll need to tell the controller in charge of '/' (index.js) to fetch data from the DB and serve it up to the view. We're gonna use res.locals to do this.

*routes/views/index.js*

```javascript
// inside the module.exports
var locals = res.locals;

view.on('init', function(next) {

  var post = Post.model.find().where('state', 'published').sort('-publishedDate').populate('author')

  post.exec(function(err, results) {
    console.log(results);
    locals.posts = results;
    next(err);
  });
});
```

18. Don't forget to require the `Post` model at the top header with the other requires.

`const Post = keystone.list('Post')`

19. Test hitting route, and checking node for results. (posts).

### Handlebars & Rendering Posts

18. Inside our templates/views/index.hbs file, lets write some code to display all our posts.

*templates/views/index.hbs*

```html
<h1> Hello, there. I sure hope this works </h1>
<hr>
<h4> Posts </h4>
/*<% posts.forEach(function (post, i) { %>*/
  {{#each posts}}
    <p>
      {{this.title}} | by {{this.author.name.first}} {{this.author.name.last}} </br>
      {{{this.content}}
      <hr>
    </p>
    {{/each}}
```

19. Go back into the Admin UI and create a third post without published. Then switch to published.

### Break
<hr>

### Post Categories

20. Create a new `PostCategory.js` model inside models directory.

*models/PostCategory.js*

```javascript
var keystone = require('keystone');
    Types = keystone.Field.Types;

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true }
});

PostCategory.add({
	name: { type: String, required: true }
});

PostCategory.relationship({ ref: 'Post', path: 'categories' });

PostCategory.register();
```

21. We have to update our `Post.js` model to reflect this relationship.

*models/Post.js*

```javascript
// add this to our schema
categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
```

22. Don't forget to include this new `PostCategory.js` model inside our main `index.js` model file.

*models/index.js*

```javascript
require('./User.js');
require('./Post.js');
require('./PostCategory');
```

22. Update the posts to include categories. Check the Mongo CLI and show the categories displayed just as object IDs.

### Display Categories in the view

23. In our templates/index.hbs file, add the following code under `this.content`.

*templates/views/index.hbs*

```html
{{#each this.categories}}
  <mark>{{this.name}}</mark>
{{/each}}
```

24. Don't forget to head to routes/views/index.js to incldue the `.populate()` method on `categories`.

*routes/views/index.js*

```javascript
.populate('categories');
```

25. Refresh page to display the categories.
