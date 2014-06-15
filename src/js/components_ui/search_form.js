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
            this.trigger('searchSubmit', { terms: terms });
        };

        this.submitOnEnterKey = function(ev) {
            if(ev.originalEvent.keyCode === 13) {
                ev.preventDefault();
                this.submit();
                console.log('THINGS');
                $(this.attr.results).modal({ show: true });
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
