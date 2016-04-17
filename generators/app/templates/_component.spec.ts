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

// Load the implementations that should be tested
import {<%= className %>} from './<%= fileName %>.component';

describe('<%= className %>', () => {
});
