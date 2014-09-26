define(function(require) {
  var defineComponent = require('flight/lib/component');

  return defineComponent(searchForm);

  function searchForm() {
    this.defaultAttrs({
      button: '#search-btn',
      input: '#search-input',
      results: '#search-results'
    });

    this.submit = function() {
      var terms = this.select('input').val();
      if (terms.length > 0) {
        this.trigger('searchSubmit', {
          terms: terms
        });
        $(this.attr.results).modal({
          show: true
        });
      }
    };

    this.submitOnEnterKey = function(ev) {
      if (ev.originalEvent.keyCode === 13) {
        ev.preventDefault();
        this.submit();
      }
    };

    this.after('initialize', function() {
      this.on('click', {
        button: this.submit
      });
      this.on('keydown', {
        input: this.submitOnEnterKey
      });
    });
  }
});
