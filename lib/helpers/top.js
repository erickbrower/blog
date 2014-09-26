module.exports = function top(collection, options) {
  var out = '',
    newest = collection.slice(0, 2);
  newest.forEach(function(item) {
    out += options.fn(item);
  });
  return out;
};
