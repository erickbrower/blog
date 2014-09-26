define(function(require) {
  var defineComponent = require('flight/lib/component'),
      depot = require('depot/depot'),
      async = require('async'),
      _ = require('lodash/dist/lodash.min');

  return defineComponent(postsMetadata);

  function postsMetadata() {
    this.defaultAttrs({
      store: depot('posts_metadata', {
        idAttribute: 'ref'
      })
    });

    this.getStoredPosts = function(refs) {
      return this.attr.store.find(function(post) {
        return _.find(refs, function(ref) {
          return post.ref === ref;
        });
      });
    };

    this.storePost = function(data) {
      this.attr.store.save(data);
    };

    this.getSearchResultsPosts = function(ev, data) {
      var self = this,
        refs = _.pluck(data.results, 'ref');
      this.syncPosts(refs, function(posts) {
        var sorted = [];
        _.each(data.results, function(result) {
          sorted.push(_.find(posts, function(post) {
            return post.ref === result.ref;
          }));
        });
        self.trigger('gotSearchResultsPosts', {
          results: sorted
        });
      });
    };

    this.fetchPost = function(ref, next) {
      var jsonUrl = ['/', ref, '/index.json'].join('');
      $.get(jsonUrl, function(data) {
        data.ref = ref;
        next(data);
      });
    };

    this.syncPosts = function(refs, next) {
      var self = this,
        posts = this.getStoredPosts(refs),
        existingRefs = _.pluck(posts, 'ref'),
        missingRefs = _.difference(refs, existingRefs),
        requests = _.map(missingRefs, function(ref) {
          return function(next) {
            self.fetchPost(ref, function(data) {
              self.storePost(data);
              posts.push(self.attr.store.get(ref));
              next();
            });
          };
        });
      async.parallelLimit(requests, 5, function() {
        next(posts);
      });
    };

    this.after('initialize', function() {
      this.on(document, 'searchResultsFound', this.getSearchResultsPosts);
    });
  }
});
