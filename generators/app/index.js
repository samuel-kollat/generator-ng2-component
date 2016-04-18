'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var fs = require('fs');

module.exports = yeoman.Base.extend({

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the ' + chalk.red('Angular2 Component') + ' generator!'
        ));

        // User options
        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'Component Name? [use UpperCamelCase for naming]',
            default: 'Home'
        }, {
            type: 'input',
            name: 'dest',
            message: 'Path to the Component location? [Parent folder of the Component, e.g \'src/app\' will result in \'src/app/new_component_name\']',
            default: 'src/app'
        }, {
            type: 'confirm',
            name: 'inline',
            message: 'Make HTML & CSS inline? [If No, separate files for HTML & CSS will be created]',
            default: false
        }, {
            when: function (response) {
                return !response.inline;
            },
            type: 'confirm',
            name: 'sass',
            message: 'Convert CSS file to Sass file? [Add .scss extension]',
            default: false
        }, {
            type: 'confirm',
            name: 'unit',
            message: 'Create Unit tests?',
            default: true
        }, {
            type: 'confirm',
            name: 'e2e',
            message: 'Create E2E tests?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.<answer>;
            done();
        }.bind(this));
    },

    writing: function () {
        // Data preparation
        var nameUpper = this.props.name;
        var nameLower = this.props.name.charAt(0).toLowerCase() + this.props.name.slice(1);
        var nameDashed =  nameLower.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
        var dest = this.props.dest.charAt(this.props.dest.length - 1) === "/"
            ? this.props.dest + nameLower + '/'
            : this.props.dest + '/' + nameLower + '/';

        // Create component directory
        mkdirp(dest, function (err) {
            if(err) {
                this.log.error(err);
                process.exit(1);
            }
        }.bind(this));

        // Index
        this.fs.copyTpl(
            this.templatePath('_index.ts'),
            this.destinationPath(dest + 'index.ts'), {
                fileName: nameLower
            }
        );

        // Inline markup & styles
        if(this.props.inline) {
            // Component
            this.fs.copyTpl(
                this.templatePath('_component_inline.ts'),
                this.destinationPath(dest + nameLower + '.component.ts'), {
                    className: nameUpper,
                    selector: nameDashed
                }
            );
        } else {
            // Component
            this.fs.copyTpl(
                this.templatePath('_component.ts'),
                this.destinationPath(dest + nameLower + '.component.ts'), {
                    fileName: nameLower,
                    className: nameUpper,
                    selector: nameDashed
                }
            );

            // HTML
            this.fs.copyTpl(
                this.templatePath('_component.html'),
                this.destinationPath(dest + nameLower + '.html'), {
                    name: nameUpper
                }
            );

            // CSS, Sass
            var cssSuffix = this.props.sass ? 'scss' : 'css';
            this.fs.copyTpl(
                this.templatePath('_component.scss'),
                this.destinationPath(dest + nameLower + '.' + cssSuffix), {
                    name: nameUpper
                }
            );
        }

        // Unit tests
        if(this.props.unit) {
            this.fs.copyTpl(
                this.templatePath('_component.spec.ts'),
                this.destinationPath(dest + nameLower + '.spec.ts'), {
                    fileName: nameLower,
                    className: nameUpper
                }
            );
        }

        // E2E tests
        if(this.props.e2e) {
            this.fs.copyTpl(
                this.templatePath('_component.e2e.ts'),
                this.destinationPath(dest + nameLower + '.e2e.ts'), {
                    className: nameUpper
                }
            );
        }
    },

    install: function () {}
});
