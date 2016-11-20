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
    nextValue: any,
    prevValue?: any
): void {
    if (nextValue === prevValue) {
        return;
    }

    const eventType = getEventByAttribute(attribute);

    if (isString(eventType)) {
        if (isFunction(prevValue)) {
            DOMNode.removeEventListener(eventType, prevValue);
        }
        DOMNode.addEventListener(eventType, nextValue);
        return;
    }

    if (!isValidAttributeValue(nextValue)) {
        remove(DOMNode, attribute, prevValue);
        return;
    }

    switch (attribute) {
        case 'checked':
        case 'disabled':
        case 'innerHTML':
        case 'nodeValue': {
            DOMNode[ attribute ] = nextValue;
            break;
        }

        case 'selected': {
            if (
                DOMNode instanceof HTMLOptionElement ||
                DOMNode instanceof HTMLOptGroupElement
            ) {
                DOMNode.selected = nextValue;
            }
            break;
        }

        case 'value': {
            if (DOMNode instanceof HTMLInputElement) {
                if (isInputWithArea(DOMNode.type)) {
                    const start = DOMNode.selectionStart;
                    const end = DOMNode.selectionEnd;

                    DOMNode.value = nextValue;
                    DOMNode.setSelectionRange(start, end);
                } else {
                    DOMNode.value = nextValue;
                }
            }
            break;
        }

        default: {
            if (DOMNode instanceof Element) {
                DOMNode.setAttribute(attribute, nextValue);
            } else if (DOMNode instanceof SVGElement) {
                DOMNode.setAttributeNS(DOMNode.namespaceURI, attribute, nextValue);
            }
        }
    }
}


export function remove(
    DOMNode: Node,
    attribute: string,
    prevValue?: any
): void {
    const eventType = getEventByAttribute(attribute);

    if (isString(eventType) && isFunction(prevValue)) {
        DOMNode.removeEventListener(eventType, prevValue);
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
