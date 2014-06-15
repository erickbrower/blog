define(function(require) {
    var defineComponent = require('flight/lib/component'),
        Handlebars = require('handlebars');

    // define the component
    return defineComponent(searchResults);

    function searchResults() {
        /*jshint multistr: true */
        this.defaultAttrs({
            title: '.modal-title',
            body: '.modal-body',
            template: '<table class=\'table table-hover table-condensed\'>\
                <thead>\
                    <tr>\
                        <th>Title</th>\
                        <th>Published</th>\
                        <th> </th>\
                    </tr>\
                </thead>\
                <tbody>\
                {{#each results}}\
                    <tr>\
                        <td><a href=\'/{{ref}}\'>{{title}}</a></td>\
                        <td>{{date}}</td>\
                        <td><a href=\'/{{ref}}\' class=\'btn btn-sm btn-default\'>Read</a></td>\
                    </tr>\
                {{else}}\
                    <h3>No results found!</h3>\
                {{/each}}\
                </tbody>\
            </table>'
        });
        /*jshint multistr: false */

        this.render = function(ev, data) {
            var tpl = Handlebars.compile(this.attr.template),
                html = tpl({ results: data.results });
            this.select('body').html(html);
        };

        this.after('initialize', function() {
            this.on(document, 'gotSearchResultsPosts', this.render);
        });
    }
});
