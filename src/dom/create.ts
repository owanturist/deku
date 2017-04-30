import {
    isUndefined
} from 'utils';
import {
    Context,
    NATIVE,
    THUNK,
    TEXT,
    EMPTY,
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


function createNative<P, C>(
    vnode: NativeVnode<P, C>,
    path: string,
    context: Context<C>
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
        const childNode = create(childVnode, childPath, context);

        DOMNode.appendChild(childNode);
    }

    return DOMNode;
}


function createThunk<P, C>(
    vnode: ThunkVnode<P, C>,
    path: string,
    context: any
    ): Node {
    const { props, children } = vnode;
    const model = { children, props, path, context };
    const outputVnode = vnode.render(model);
    const outputPath = concatPaths(path, outputVnode, 0);
    const DOMNode = create(outputVnode, outputPath, context);

    vnode.state = {
        vnode: outputVnode
    };

    return DOMNode;
}


function createText(text: string): Text {
    return document.createTextNode(text);
}


export function create<P, C>(
    vnode: Vnode<P, C>,
    path: string,
    context: Context<C>
    ): Node {
    switch (vnode.type) {
        case NATIVE: {
            return createNative(vnode, path, context);
        }

        case THUNK: {
            return createThunk(vnode, path, context);
        }

        case TEXT: {
            return createText(vnode.text);
        }

        case EMPTY: {
            return DOMNodeFactory('noscript');
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}
