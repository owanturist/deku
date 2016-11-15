import {
    isString,
    isFunction
} from 'utils';

import {
    getEventByAttribute
} from './events';


function isValidAttributeValue(value: any): boolean {
    switch (typeof value) {
        case 'string':
        case 'number': {
            return true;
        }
        case 'boolean': {
            return value;
        }
        default: {
            return false;
        }
    }
}


function isInputWithArea(type: string): boolean {
    switch (type) {
        case 'text':
        case 'search':
        case 'tel':
        case 'url':
        case 'email':
        case 'password': {
            return true;
        }

        default: {
            return false;
        }
    }
}


export function set(
    DOMNode: Node,
    attribute: string,
    value: any,
    previousValue?: any
): void {
    if (value === previousValue) {
        return;
    }

    const eventType = getEventByAttribute(attribute);

    if (isString(eventType)) {
        if (isFunction(previousValue)) {
            DOMNode.removeEventListener(eventType, previousValue);
        }
        DOMNode.addEventListener(eventType, value);
        return;
    }

    if (!isValidAttributeValue(value)) {
        remove(DOMNode, attribute, previousValue);
        return;
    }

    switch (attribute) {
        case 'checked':
        case 'disabled':
        case 'innerHTML':
        case 'nodeValue': {
            DOMNode[ attribute ] = value;
            break;
        }

        case 'selected': {
            if (
                DOMNode instanceof HTMLOptionElement ||
                DOMNode instanceof HTMLOptGroupElement
            ) {
                DOMNode.selected = value;
            }
            break;
        }

        case 'value': {
            if (DOMNode instanceof HTMLInputElement) {
                if (isInputWithArea(DOMNode.type)) {
                    const start = DOMNode.selectionStart;
                    const end = DOMNode.selectionEnd;

                    DOMNode.value = value;
                    DOMNode.setSelectionRange(start, end);
                } else {
                    DOMNode.value = value;
                }
            }
            break;
        }


        default: {
            if (DOMNode instanceof Element) {
                DOMNode.setAttribute(attribute, value);
            } else if (DOMNode instanceof SVGElement) {
                DOMNode.setAttributeNS(DOMNode.namespaceURI, attribute, value);
            }
        }
    }
}


export function remove(
    DOMNode: Node,
    attribute: string,
    previousValue?: any
): void {
    const eventType = getEventByAttribute(attribute);

    if (isString(eventType) && isFunction(previousValue)) {
        DOMNode.removeEventListener(eventType, previousValue);
        return;
    }

    switch (attribute) {
        case 'checked':
        case 'disabled':
        case 'selected': {
            DOMNode[ attribute ] = false;
            break;
        }

        case 'innerHTML':
        case 'nodeValue':
        case 'value': {
            DOMNode[ attribute ] = '';
            break;
        }

        default: {
            if (DOMNode instanceof Element) {
                DOMNode.removeAttribute(attribute);
            }
        }
    }
}
