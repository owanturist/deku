import { reduceArray } from 'utils/reduce-array';
import { isUndefined } from 'utils/is-undefined';
import { isNull } from 'utils/is-null';

/**
 * This function lets us create virtual nodes using a simple
 * syntax. It is compatible with JSX transforms so you can use
 * JSX to write nodes that will compile to this function.
 */

export function getKey(maybeKey: any): string | void {
    switch (typeof maybeKey) {
        case 'number': {
            return (maybeKey as number).toString();
        }

        case 'string': {
            return maybeKey as string;
        }

        default:
            return undefined;
    }
}

export function create(type, attributes?, ...children): any {
    let key;

    if (isNull(attributes)) {
        attributes = {};
    } else {
        key = getKey(attributes.key);

        delete attributes.key;
    }

    children = reduceArray(reduceChildren, [], children);

    switch (typeof type) {
        case 'object': {
            return createThunkElement(type.render, key, attributes, children, type);
        }

        case 'function': {
            return createThunkElement(type, key, attributes, children, type);
        }

        default: {
            return createNativeElement(type, attributes, children, key);
        }
    }
}

/**
 * Cleans up the array of child elements.
 * - Flattens nested arrays
 * - Converts raw strings and numbers into vnodes
 * - Filters out undefined elements
 */
function reduceChildren(children, vnode) {
    switch (typeof vnode) {
        case 'undefined': {
            throw new Error(`vnode can't be undefined. Did you mean to use null?`);
        }

        case 'string': {
            children.push(
                createTextElement(vnode as string)
            );

            return children;
        }

        case 'number': {
            children.push(
                createTextElement((vnode as number).toString())
            );

            return children;
        }

        case 'object': {
            if (isNull(vnode)) {
                children.push(createEmptyElement());

                return children;
            }

            if (Array.isArray(vnode)) {
                return reduceArray(reduceChildren, children, vnode);
            }
        }

        default: {
            children.push(vnode);

            return children;
        }
    }
}


export function createNativeElement(tagName, attributes, children, key) {
    return {
        type: 'native',
        tagName,
        attributes,
        children,
        key
    };
}

/**
 * Text nodes are stored as objects to keep things simple
 */

export function createTextElement(text: string) {
    return {
        type: 'text',
        nodeValue: text
    };
}

/**
 * Text nodes are stored as objects to keep things simple
 */

export function createEmptyElement() {
    return {
        type: 'empty'
    };
}

/**
 * Lazily-rendered virtual nodes
 */

export function createThunkElement(fn, key, props, children, options) {
    return {
        type: 'thunk',
        fn,
        children,
        props,
        options,
        key
    };
}

/**
 * Functional type checking
 */

export let isThunk = (node) => {
    return node.type === 'thunk';
};

export let isText = (node) => {
    return node.type === 'text';
};

export let isEmpty = (node) => {
    return node.type === 'empty';
};

export let isNative = (node) => {
    return node.type === 'native';
};

export let isSameThunk = (left, right) => {
    return isThunk(left) && isThunk(right) && left.fn === right.fn;
};

/**
 * Group an array of virtual elements by their key, using index as a fallback.
 */
export let groupByKey = (children) => {
    let iterator = (acc, child, i) => {
        if (!isUndefined(child) && child !== false) {
            let key = isNull(child) ? i : (child.key || i);
            acc.push({
                key: String(key),
                item: child,
                index: i
            });
        }
        return acc;
    };

    return reduceArray(iterator, [], children);
};

/**
 * Create a node path.
 */
export function createPath(parts: string[]): string {
    return parts.join('.');
}
