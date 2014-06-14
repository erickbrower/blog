define(function(require) {
    var defineComponent = require('flight/lib/component'),
        depot = require('depot/depot'),
        lunr = require('lunr');

    // define the component
    return defineComponent(searchResults);

    function searchResults() {
        this.defaultAttrs({
            title: '.modal-title',
            body: '.modal-body'
        });

        this.render = function(ev, data) {
        };

        this.after('initialize', function() {
            this.on(document, 'searchResultsFound', this.render);
        });
    }
});
