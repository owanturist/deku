import * as deku from '../..';
import * as trigger from 'trigger-event';
import { assert } from 'chai';

import {
    updateElement
} from 'dom';
import {
    Actions
} from 'diff';
import {
    createTextElement
} from 'element';


describe('Dom update', () => {
    it('patching elements', () => {
        let {setAttribute, removeAttribute} = Actions;
        let DOMElement = document.createElement('div');

        updateElement()(DOMElement, setAttribute('color', 'red', undefined));
        assert.equal(DOMElement.getAttribute('color'), 'red', 'add attribute');

        updateElement()(DOMElement, setAttribute('color', 'blue', 'red'));
        assert.equal(DOMElement.getAttribute('color'), 'blue', 'update attribute');

        updateElement()(DOMElement, setAttribute('color', false, 'blue'));
        assert.equal(DOMElement.hasAttribute('color'), false, 'remove attribute with false');

        updateElement()(DOMElement, setAttribute('color', 'red', false));
        updateElement()(DOMElement, setAttribute('color', null, 'red'));
        assert.equal(DOMElement.hasAttribute('color'), false, 'remove attribute with null');

        updateElement()(DOMElement, setAttribute('color', 'red', null));
        updateElement()(DOMElement, setAttribute('color', undefined, 'red'));
        assert.equal(DOMElement.hasAttribute('color'), false, 'remove attribute with undefined');

        updateElement()(DOMElement, removeAttribute('color', undefined));
        assert.equal(DOMElement.getAttribute('color'), null, 'remove attribute');
    });

    it('patching children', () => {
        let {insertChild, updateChild, removeChild, insertBefore, setAttribute, updateChildren} = Actions;
        let DOMElement = document.createElement('div');

        updateElement()(
            DOMElement,
            updateChildren([
                insertChild(createTextElement('Hello'), 0, '0')
            ])
        );
        assert.equal(DOMElement.innerHTML, 'Hello', 'text child inserted');

        updateElement()(
            DOMElement,
            updateChildren([
                updateChild(0, [
                    setAttribute('nodeValue', 'Goodbye', undefined)
                ])
            ])
        );
        assert.equal(DOMElement.innerHTML, 'Goodbye', 'text child updated');

        updateElement()(
            DOMElement,
            updateChildren([
                removeChild(0)
            ])
        );
        assert.equal(DOMElement.innerHTML, '', 'text child removed');

        updateElement()(
            DOMElement,
            updateChildren([
                insertChild(<span>Hello</span>, 0, '0')
            ])
        );
        assert.equal(DOMElement.innerHTML, '<span>Hello</span>', 'element child inserted');

        updateElement()(
            DOMElement,
            updateChildren([
                updateChild(0, [
                    setAttribute('color', 'blue', undefined)
                ])
            ])
        );
        assert.equal(DOMElement.innerHTML, '<span color="blue">Hello</span>', 'element child updated');

        updateElement()(
            DOMElement,
            updateChildren([
                removeChild(0)
            ])
        );
        assert.equal(DOMElement.innerHTML, '', 'element child removed');

        updateElement()(
            DOMElement,
            updateChildren([
                insertChild(<span>0</span>, 0, '0'),
                insertChild(<span>1</span>, 1, '1'),
                insertChild(<span>2</span>, 2, '2')
            ])
        );
        assert.equal(DOMElement.childNodes.length, 3, 'multiple children added');

        updateElement()(DOMElement.children[0], insertBefore(2));
        assert.equal(DOMElement.innerHTML, '<span>1</span><span>0</span><span>2</span>', 'element moved');
    });

    it('patching event handlers', () => {
        let {setAttribute, removeAttribute} = Actions;
        let count = 0;
        let handler = e => count++;
        let DOMElement = document.createElement('div');
        document.body.appendChild(DOMElement);

        updateElement()(DOMElement, setAttribute('onClick', handler, undefined));
        trigger(DOMElement, 'click');
        assert.equal(count, 1, 'event added');

        updateElement()(DOMElement, removeAttribute('onClick', handler));
        trigger(DOMElement, 'click');
        assert.equal(count, 1, 'event removed');

        document.body.removeChild(DOMElement);
    });

    it('patching inputs', () => {
        let {setAttribute, removeAttribute} = Actions;
        let input = document.createElement('input');

        updateElement()(input, setAttribute('value', 'Bob', undefined));
        assert.equal(input.value, 'Bob', 'value property set');

        updateElement()(input, setAttribute('value', 'Tom', 'Bob'));
        assert.equal(input.value, 'Tom', 'value property updated');

        updateElement()(input, setAttribute('value', 0, 'Tom'));
        assert.equal(input.value, '0', 'value property updated to zero');

        updateElement()(input, removeAttribute('value', 'Tom'));
        assert.equal(input.value, '', 'value property removed');
    });
});
