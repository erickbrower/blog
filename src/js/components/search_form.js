define(function(require) {
    var defineComponent = require('flight/lib/component');

    // define the component
    return defineComponent(searchForm);

    function searchForm() {
        this.defaultAttrs({
            button: '#search-btn',
            input: '#search-input',
            results: '#search-results'
        });

        this.submit = function() {
            var terms = this.select('input').val();
            this.trigger('searchSubmit', { terms: terms });
        };

        this.after('initialize', function() {
            this.on('click', {
                button: this.submit
            });
        });
    }
});
