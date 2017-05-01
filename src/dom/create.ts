import {
    isUndefined
} from '../utils';
import {
    Vnode,
    Native,
    concatPaths
} from '../vnode';
import {
    set as setAttribute
} from './attribute';
import {
    createDOMElement
} from './element';

interface FactoryCache {
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
    tagger: any,
    path: string,
    ): Node {
    const { tagName, attributes, children } = vnode;
    const DOMNode = DOMNodeFactory(tagName);
    const { length } = children;

    for (const name in attributes) {
        if (attributes.hasOwnProperty(name)) {
            setAttribute(DOMNode, tagger, name, attributes[ name ]);
        }
    }

    if (length === 0) {
        return DOMNode;
    }

    for (let index = 0; index < length; index++) {
        const childVnode = children[ index ];
        const childPath = concatPaths(path, index);
        const childNode = create(childVnode, tagger, childPath);

        DOMNode.appendChild(childNode);
    }

    return DOMNode;
}

function createText(text: string): Text {
    return document.createTextNode(text);
}

export function create(
    vnode: Vnode,
    tagger,
    path: string
    ): Node {
    switch (vnode.type) {
        case 'NATIVE': {
            return createNative(vnode, tagger, path);
        }

        case 'TEXT': {
            return createText(vnode.text);
        }
    }
}
