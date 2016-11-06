import * as deku from '../..';
import * as isDOM from 'is-dom';
import * as trigger from 'trigger-event';
import { assert } from 'chai';

import {
    createElement
} from 'dom';

describe('Dom create', () => {
    it('create element', () => {
        const DOMElement = createElement(<div color='red' />);
        assert.isTrue(isDOM(DOMElement), 'is DOM element');
        assert.equal(DOMElement.tagName, 'DIV', 'is correct tag');
        assert.equal(DOMElement.getAttribute('color'), 'red', 'has attribute');
    });


    it('create element with text', () => {
        const DOMElement = createElement(<div>Hello World</div>);
        assert.equal(DOMElement.firstChild.nodeType, 3, 'is a text element');
        assert.equal(DOMElement.firstChild.data, 'Hello World', 'has text content');
    });

    it('create element with child', () => {
        const DOMElement = createElement(<div><span color='red' /></div>);
        assert.equal(DOMElement.children.length, 1, 'has children');
        assert.equal(DOMElement.innerHTML, '<span color="red"></span>', 'has correct content');
    });

    it('create element with null child', () => {
        const DOMElement = createElement(<div>{null}</div>);
        assert.equal(DOMElement.children.length, 1, 'has one child');
        assert.equal(DOMElement.innerHTML, '<noscript></noscript>', 'has correct content');
    });

    it('create input element', () => {
        const DOMElement = createElement(<input type='text' value='foo' disabled />);
        assert.equal(DOMElement.tagName, 'INPUT', 'is correct tag');
        assert.equal(DOMElement.type, 'text', 'is a text input');
        assert.equal(DOMElement.value, 'foo', 'has a value');
        assert.equal(DOMElement.disabled, true, 'is disabled');
    });

    it('create range input', () => {
        const DOMElement = createElement(<input type='range' min={0} max={10} value={5} step={1} />);
        assert.equal(DOMElement.value, '5', 'has a value');
    });

    it('create input element with zero value', () => {
        const DOMElement = createElement(<input type='text' value={0} disabled />);
        assert.equal(DOMElement.value, '0', 'has a value');
    });

    it('create element with event handlers', () => {
        let count = 0;
        const DOMElement = createElement(<span onClick={e => count += 1} />);
        document.body.appendChild(DOMElement);
        trigger(DOMElement, 'click');
        assert.equal(count, 1, 'event added');
        assert.equal(DOMElement.outerHTML, '<span></span>');
        document.body.removeChild(DOMElement);
    });

    it('create element with thunk', () => {
        let Component: any = {
            render: () => <div />
        };
        const DOMElement = createElement(<Component />);
        assert.isTrue(isDOM(DOMElement), 'is DOM element');
        assert.equal(DOMElement.tagName, 'DIV', 'is correct tag');
    });

    it('crate element with plain function thunk', () => {
        let Component = () => <div />;
        const DOMElement = createElement(<Component />);
        assert.isTrue(isDOM(DOMElement), 'is DOM element');
        assert.equal(DOMElement.tagName, 'DIV', 'is correct tag');
    });

    it('create select element', () => {
        const DOMElement = createElement(
            <select>
                <option>Hello</option>
                <option selected>World</option>
            </select>
        );
        assert.equal(DOMElement.tagName, 'SELECT', 'is correct tag');
        assert.equal(DOMElement.selectedIndex, 1, 'correct option is selected');
        assert.equal(DOMElement.options[1].selected, true, 'correct option is selected');
    });
});
