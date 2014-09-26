define(function(require) {
  var defineComponent = require('flight/lib/component'),
      depot = require('depot/depot'),
      lunr = require('lunr');

  return defineComponent(searchIndex);

  function searchIndex() {
    this.defaultAttrs({
      store: depot('idx', {
        storageAdaptor: sessionStorage
      })
    });

    this.init = function() {
      var idxData = this.getIndexData(),
        self = this;
      if (!idxData) {
        this.fetchIndexData(function(data) {
          self.saveIndexData(data);
          self.loadIndex(data);
        });
      } else {
        this.loadIndex(idxData);
      }
    };

    this.getIndexData = function() {
      var res = this.attr.store.all();
      if (res.length > 0) {
        return res[0];
      }
      return null;
    };

    this.fetchIndexData = function(next) {
      $.get('/data/posts_idx.json', function(data) {
        next(data);
      });
    };

    this.saveIndexData = function(data) {
      this.attr.store.save(data);
    };

    this.loadIndex = function(idxData) {
      this.idx = lunr.Index.load(idxData);
    };

    this.search = function(ev, data) {
      var results = this.idx.search(data.terms);
      this.trigger('searchResultsFound', {
        results: results
      });
    };

    this.after('initialize', function() {
      this.init();
      this.on(document, 'searchSubmit', this.search);
    });
  }

});
