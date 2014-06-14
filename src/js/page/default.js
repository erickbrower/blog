define(function(require) {

    var searchForm = require('components/search_form'),
        searchResults = require('components/search_results');

    return initialize;

    function initialize() {
        // MyComponent.attachTo(document);
        searchForm.attachTo('#search-form');
        searchResults.attachTo('#search-results');
    }

});
