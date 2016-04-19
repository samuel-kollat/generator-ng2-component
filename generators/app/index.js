'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

const Require = 0;
const Urls = 1;

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
            message: chalk.bgCyan.white('Component Name?') + chalk.yellow(' [use UpperCamelCase]'),
            default: 'Home'
        }, {
            type: 'input',
            name: 'dest',
            message: chalk.bgCyan.white('Path to the Component location?') + chalk.yellow(' [e.g \'src/app\' will result in \'src/app/<component>\']'),
            default: 'src/app'
        }, {
            type: 'confirm',
            name: 'inlineCss',
            message: chalk.bgCyan.white('Make HTML & CSS inline?') + chalk.yellow(' [') + chalk.red('y') + chalk.yellow(' for inline ') + chalk.red('N') + chalk.yellow(' for separate files]'),
            default: false
        }, {
            when: function (response) {
                return !response.inline;
            },
            type: 'list',
            name: 'css',
            message: chalk.bgCyan.white('Use CSS preprocessor or use pure CSS?'),
            choices: ['Scss', 'Less', 'Css'],
            filter: function (str){
                return str.toLowerCase();
            }
        }, {
            when: function (response) {
                return !response.inline;
            },
            type: 'list',
            name: 'includes',
            message: chalk.bgCyan.white('How to include HTML & CSS files?'),
            choices: [{
                name:'require (e.g. for Webpack build)',
                value: Require
            }, {
                name: 'templateUrl & styleUrls',
                value: Urls
            }]
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

        console.log(this.props.includes);

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
            if(this.props.includes === Urls) {
                this.fs.copyTpl(
                    this.templatePath('_component_urls.ts'),
                    this.destinationPath(dest + nameLower + '.component.ts'), {
                        fileName: nameLower,
                        className: nameUpper,
                        selector: nameDashed,
                        stylesExtension: this.props.css
                    }
                );
            } else {
                this.fs.copyTpl(
                    this.templatePath('_component.ts'),
                    this.destinationPath(dest + nameLower + '.component.ts'), {
                        fileName: nameLower,
                        className: nameUpper,
                        selector: nameDashed,
                        stylesExtension: this.props.css
                    }
                );
            }

            // HTML
            this.fs.copyTpl(
                this.templatePath('_component.html'),
                this.destinationPath(dest + nameLower + '.html'), {
                    name: nameUpper
                }
            );

            // CSS, Sass, Less
            this.fs.copyTpl(
                this.templatePath('_component.css'),
                this.destinationPath(dest + nameLower + '.' + this.props.css), {
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
