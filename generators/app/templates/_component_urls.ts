import {Component} from 'angular2/core'
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators,AbstractControl} from "angular2/common";
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: '<%= selector %>',
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    templateUrl: './<%= fileName %>.html',
    styleUrls: ['./<%= fileName %>.<%= stylesExtension %>'],
})
export class <%= className %> {
    constructor(private fb: FormBuilder) {}
}
