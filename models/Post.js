var keystone = require('keystone'),
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
  categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Post.register();
