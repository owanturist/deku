import { setAttribute as setNativeAttribute } from 'utils/set-attribute';
import { isValidAttributeValue } from 'utils/is-valid-attribute-value';
import { isString } from 'utils/is-string';
import { isFunction } from 'utils/is-function';
import { indexOf } from 'utils/index-of';
import { setify } from 'utils/setify';
import { getEventsByName } from './events';

export function removeAttribute(DOMElement, name, previousValue) {
    let eventType = getEventsByName(name);
    if (isString(eventType) && isFunction(previousValue)) {
        DOMElement.removeEventListener(eventType, previousValue);
        return;
    }
    switch (name) {
        case 'checked':
        case 'disabled':
        case 'selected':
            DOMElement[name] = false;
            return;
        case 'innerHTML':
        case 'nodeValue':
        case 'value':
            DOMElement[name] = '';
            return;
        default:
            DOMElement.removeAttribute(name);
    }
}

export function setAttribute(DOMElement, name, value, previousValue?) {
    if (value === previousValue) {
        return;
    }
    const eventType = getEventsByName(name);
    if (isString(eventType)) {
        if (isFunction(previousValue)) {
            DOMElement.removeEventListener(eventType, previousValue);
        }
        DOMElement.addEventListener(eventType, value);
        return;
    }
    if (!isValidAttributeValue(value)) {
        removeAttribute(DOMElement, name, previousValue);
        return;
    }
    switch (name) {
        case 'checked':
        case 'disabled':
        case 'innerHTML':
        case 'nodeValue':
            DOMElement[name] = value;
            return;
        case 'selected':
            DOMElement.selected = value;
            // Fix for IE/Safari where select is not correctly selected on change
            if (DOMElement.tagName === 'OPTION' && DOMElement.parentNode) {
                let select = DOMElement.parentNode;
                select.selectedIndex = indexOf(DOMElement, 0, select.options);
            }
            return;
        case 'value':
            setify(DOMElement, value);
            return;
        default:
            setNativeAttribute(DOMElement, name, value);
    }
}
