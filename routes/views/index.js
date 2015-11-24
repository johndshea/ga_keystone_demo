var keystone = require('keystone');
const Post = keystone.list('Post');

exports = module.exports = function (req, res){
  var view = new keystone.View(req, res);

  var locals = res.locals;

  view.on('init', function(next) {

    var post = Post.model.find().where('state', 'published').sort('-publishedAt').populate('author').populate('categories')

    post.exec(function(err, results){
      console.log(results);
      locals.posts = results;
      next(err)
    });
  });
  view.render('index');
};
