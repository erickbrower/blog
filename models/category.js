exports.init = function(db) {
  var Category = db.define('Category', {
    name: {
      type: String,
      length: 255,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  Category.validatesPresenceOf('name');

  Category.validatesUniquenessOf('name', {
    message: 'A Category with that name already exists'
  });

  return Category;
};
