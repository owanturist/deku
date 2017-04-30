import {
    isUndefined
} from 'utils';
import {
    Vnode,
    Native,
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
    vnode: Native,
    path: string,
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
        const childPath = concatPaths(path, index);
        const childNode = create(childVnode, childPath);

        DOMNode.appendChild(childNode);
    }

    return DOMNode;
}


function createText(text: string): Text {
    return document.createTextNode(text);
}


export function create(
    vnode: Vnode,
    path: string
    ): Node {
    switch (vnode.type) {
        case 'NATIVE': {
            return createNative(vnode, path);
        }

        case 'TEXT': {
            return createText(vnode.text);
        }
    }
}
