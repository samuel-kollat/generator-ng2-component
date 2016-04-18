import {
    it,
    inject,
    injectAsync,
    describe,
    beforeEachProviders,
    TestComponentBuilder
} from 'angular2/testing';

import {Component, provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

// Load the implementations that should be tested
import {<%= className %>} from './<%= fileName %>.component';

describe('<%= className %>', () => {

    beforeEachProviders(() => [
        BaseRequestOptions,
        MockBackend,
        provide(Http, {
            useFactory: function(backend, defaultOptions) {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        }),
        <%= className %>
    ]);

    // Add tests
});
