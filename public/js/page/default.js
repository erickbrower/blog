define(function(require) {

    var searchForm = require('components_ui/search_form'),
        searchResults = require('components_ui/search_results'),
        searchIndex = require('components_data/search_index'),
        postsMetadata = require('components_data/posts_metadata');

    return initialize;

    function initialize() {
        searchIndex.attachTo(document);
        postsMetadata.attachTo(document);
        searchForm.attachTo('#search-form');
        searchResults.attachTo('#search-results');
    }

});
