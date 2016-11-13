import { createPath } from 'vnode';

/**
 * Turn an object of key/value pairs into a HTML attribute string. This
 * function is responsible for what attributes are allowed to be rendered and
 * should handle any other special cases specific to deku.
 */

function attributesToString(attributes: any): string {
    let str = '';

    for (let name in attributes) {
        if (name === 'innerHTML') {
            continue;
        }

        const value = attributes[ name ];

        switch (typeof value) {
            case 'string':
            case 'number': {
                str += ` ${name}="${value}"`;

                continue;
            }

            case 'boolean': {
                if (value) {
                    str += ` ${name}`;
                }

                continue;
            }

            default: {
                continue;
            }
        }
    }

    return str;
}


function renderTag(tagName: string, attributes: any, content: string): string {
    return `<${tagName}${attributesToString(attributes)}>${content}</${tagName}>`;
}

/**
 * Render a virtual element to a string. You can pass in an option state context
 * object that will be given to all components.
 */

export function renderString(vnode, context?, path?: string): string {
    switch (vnode.type) {
        case 'text':
            return renderTextNode(vnode);
        case 'empty':
            return renderEmptyNode();
        case 'thunk':
            return renderThunk(vnode, context, path);
        case 'native':
            return renderNative(vnode, context, path);
        default:
            return '';
    }
}

function renderTextNode(vnode): string {
    return vnode.nodeValue;
}

function renderEmptyNode(): string {
    return '<noscript></noscript>';
}

function renderThunk(vnode, context?, path: string = '0'): string {
    let { props, children } = vnode;
    let output = vnode.fn({ children, props, path, context });
    return renderString(output, context, path);
}

function renderNative(vnode, context?, path: string = '0'): string {
    const { attributes, tagName, children } = vnode;

    if (attributes.innerHTML) {
        return renderTag(tagName, attributes, attributes.innerHTML);
    }

    const { length } = children;

    if (length === 0) {
        return renderTag(tagName, attributes, '');
    }

    let content = '';

    for (let index = 0; index < length; index++) {
        const child = children[ index ];
        content += renderString(child, context, createPath([ path, child.key || index ]));
    }

    return renderTag(tagName, attributes, content);
}
