import * as deku from '../..';
import { assert } from 'chai';

import {
    setAttribute
} from 'dom/setAttribute';

describe('Dom setAttribute', () => {
    it('setAttribute (checkboxes)', () => {
        let DOMElement = document.createElement('input');
        DOMElement.setAttribute('type', 'checkbox');

        setAttribute(DOMElement, 'checked', true);
        assert.isTrue(DOMElement.checked, 'element checked');

        setAttribute(DOMElement, 'checked', false);
        assert.isTrue(!DOMElement.checked, 'element unchecked');

        setAttribute(DOMElement, 'disabled', true);
        assert.isTrue(DOMElement.disabled, 'element disabled');

        setAttribute(DOMElement, 'disabled', false);
        assert.isTrue(!DOMElement.disabled, 'element enabled');

        setAttribute(DOMElement, 'value', 'foo');
        assert.equal(DOMElement.value, 'foo', 'value set');

        setAttribute(DOMElement, 'value', 2);
        assert.equal(DOMElement.value, '2', 'value updated');

        setAttribute(DOMElement, 'value', null);
        assert.equal(DOMElement.value, '', 'value removed');
    });

    it('setAttribute (textfield)', () => {
        let DOMElement = document.createElement('input');
        DOMElement.setAttribute('type', 'text');
        setAttribute(DOMElement, 'disabled', true);
        assert.isTrue(DOMElement.disabled, 'element disabled');
        setAttribute(DOMElement, 'disabled', false);
        assert.isTrue(!DOMElement.disabled, 'element enabled');
        setAttribute(DOMElement, 'value', 'foo');
        assert.equal(DOMElement.value, 'foo', 'value set');
        setAttribute(DOMElement, 'value', 2);
        assert.equal(DOMElement.value, '2', 'value updated');
        setAttribute(DOMElement, 'value', 0);
        assert.equal(DOMElement.value, '0', 'value updated to zero');
        setAttribute(DOMElement, 'value', null);
        assert.equal(DOMElement.value, '', 'value removed');
    });

    it('setAttribute (innerHTML)', () => {
        let DOMElement = document.createElement('div');
        setAttribute(DOMElement, 'innerHTML', '<span></span>');
        assert.equal(DOMElement.innerHTML, '<span></span>', 'innerHTML set');
        setAttribute(DOMElement, 'innerHTML', '');
        assert.equal(DOMElement.innerHTML, '', 'innerHTML removed');
    });

    it('setAttribute (event handler)', () => {
        let DOMElement = document.createElement('div');
        setAttribute(DOMElement, 'onClick', el => 'bar');
        assert.equal(DOMElement.outerHTML, '<div></div>', 'event handler');
    });

    it('setting the same attribute value does not touch the DOM', () => {
        let el = document.createElement('div');
        setAttribute(el, 'name', 'Bob', null);
        el.setAttribute = function() {
            throw new Error('DOM was touched');
        };
        setAttribute(el, 'name', 'Bob', 'Bob');
    });

    it('setting value should maintain cursor position', () => {
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        document.body.appendChild(input);

        // Cursor position
        setAttribute(input, 'value', 'Game of Thrones');
        input.focus();
        input.setSelectionRange(5, 7);

        // Position should be the same
        setAttribute(input, 'value', 'Way of Kings');
        assert.equal(input.selectionStart, 5, 'selection start');
        assert.equal(input.selectionEnd, 7, 'selection end');

        // Remove focus
        if (input.setActive) {
            document.body.setActive();
        } else {
            input.blur();
        }

        // The selection should changed
        // setAttribute(input, 'value', 'Hello World!');
        // assert.notEqual(input.selectionStart, 5, 'selection start');
        // assert.notEqual(input.selectionEnd, 7, 'selection end');

        // Clean up
        document.body.removeChild(input);
    });

    // Browser throw an unavoidable error if you try getting the selection from
    // email inputs. It's a browser bug.
    it('setting value on fields that do not maintain selection', () => {
        let input = document.createElement('input');
        input.setAttribute('type', 'email');
        setAttribute(input, 'value', 'a@b.com');
    });

    it('selecting option elements', () => {
        let el = document.createElement('div');
        el.innerHTML = `
            <select>
                <option selected>one</option>
                <option>two</option>
            </select>
        `;
        let options = el.querySelectorAll('option');
        setAttribute(options[1], 'selected', true);
        assert.equal(options[0].selected, false, 'is not selected');
        assert.equal(options[1].selected, true, 'is selected');
    });

    it('setting value to svg element', () => {
        let namespace = 'http://www.w3.org/2000/svg';
        let d = 'M150 0 L75 200 L225 200 Z';
        let svg = document.createElementNS(namespace, 'svg');
        let path = document.createElementNS(namespace, 'path');

        svg.appendChild(path);
        document.body.appendChild(svg);

        // SVG native attributes (not including xlink:href) do not share the SVG namespace
        // working it case `path.setAttributeNS(null, 'd'() d)`;
        setAttribute(path, 'd', d);

        assert.equal(path.getBoundingClientRect().width, 150, 'svg path width');
        assert.equal(path.getBoundingClientRect().height, 200, 'svg path height');

        document.body.removeChild(svg);
    });

});
