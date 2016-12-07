import {
    isUndefined
} from 'utils';
import {
    NATIVE as NATIVE_VNODE,
    THUNK as THUNK_VNODE,
    TEXT as TEXT_VNODE,
    EMPTY as EMPTY_VNODE,
    Vnode,
    Native as NativeVnode,
    Thunk as ThunkVnode,
    concatPaths
} from 'vnode';
import {
    set as setAttribute
} from './attribute';
import {
    createDOMElement
} from './element';


type FactoryCache = {
    [ tagName: string ]: Element;
}

function createDOMNodeFactory() {
    const cache: FactoryCache = {};

    return (tagName: string): Node => {
        let cachedNode = cache[ tagName ];

        if (isUndefined(cachedNode)) {
            cachedNode = cache[ tagName ] = createDOMElement(tagName);
        }

        return cachedNode.cloneNode(false);
    };
}

const DOMNodeFactory = createDOMNodeFactory();


function createNative(
    vnode: NativeVnode,
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
        const childPath = concatPaths(path, childVnode, index);
        const childNode = create(childVnode, childPath, dispatch, context);

        DOMNode.appendChild(childNode);
    }

    return DOMNode;
}

function createThunk(
    vnode: ThunkVnode,
    path: string,
    dispatch: any,
    context: any
    ): Node {
    const { props, children } = vnode;
    const model = { children, props, path, dispatch, context };
    const outputVnode = vnode.render(model);
    const outputPath = concatPaths(path, outputVnode, 0);
    const DOMNode = create(outputVnode, outputPath, dispatch, context);

    vnode.onMount(model);
    vnode.state = {
        vnode: outputVnode,
        model
    };

    return DOMNode;
}


function createText(text: string): Text {
    return document.createTextNode(text);
}


export function create(
    vnode: Vnode,
    path: string,
    dispatch: any,
    context: any
    ): Node {
    switch (vnode.type) {
        case NATIVE_VNODE: {
            return createNative(vnode, path, dispatch, context);
        }

        case THUNK_VNODE: {
            return createThunk(vnode, path, dispatch, context);
        }

        case TEXT_VNODE: {
            return createText(vnode.text);
        }

        case EMPTY_VNODE: {
            return DOMNodeFactory('noscript');
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}
