import Deku from 'types';

import {
    isUndefined,
    createElement
} from 'utils';
import {
    createNestingPath
} from 'vnode';
import {
    set as setAttribute
} from './attribute';


interface FactoryCache {
    [ tagName: string ]: Element;
}

export function createDOMNodeFactory() {
    const cache: FactoryCache = {};

    return (tagName: string): Node => {
        let cachedNode = cache[ tagName ];

        if (isUndefined(cachedNode)) {
            cachedNode = cache[ tagName ] = createElement(tagName);
        }

        return cachedNode.cloneNode(false);
    };
}

const DOMNodeFactory = createDOMNodeFactory();


export function create(
    vnode: Deku.Vnode,
    path: string,
    dispatch: any,
    context: any
): Node {
    switch (vnode.type) {
        case 'native': {
            return createNative(vnode, path, dispatch, context);
        }

        case 'thunk': {
            return createThunk(vnode, path, dispatch, context);
        }

        case 'text': {
            return createText(vnode.text);
        }

        case 'empty': {
            return DOMNodeFactory('noscript');
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}


function createNative(
    vnode: Deku.NativeVnode,
    path: string,
    dispatch: any,
    context: any
): Node {
    const { tagName, attributes, children } = vnode;
    const DOMNode = DOMNodeFactory(tagName);
    const { length } = children;

    for (let name in attributes) {
        if (attributes.hasOwnProperty(name)) {
            setAttribute(DOMNode, name, attributes[ name ]);
        }
    }

    if (length === 0) {
        return DOMNode;
    }

    for (let index = 0; index < length; index++) {
        const childVnode = children[ index ];
        const childPath = createNestingPath(childVnode, path, index);
        const childNode = create(childVnode, childPath, dispatch, context);

        DOMNode.appendChild(childNode);
    }

    return DOMNode;
}

function createThunk(
    vnode: Deku.ThunkVnode,
    path: string,
    dispatch: any,
    context: any
): Node {
    const { props, children } = vnode;
    const model = { children, props, path, dispatch, context };
    const outputVnode = vnode.render(model);
    const outputPath = createNestingPath(outputVnode, path, 0);
    const DOMNode = create(outputVnode, outputPath, dispatch, context);

    vnode.state = {
        vnode: outputVnode,
        model
    };

    return DOMNode;
}


function createText(text: string): Text {
    return document.createTextNode(text);
}
