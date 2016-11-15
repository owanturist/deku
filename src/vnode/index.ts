import Deku from 'types';

import {
    isNil,
    isNull
} from 'utils';

export function create(
    type: string,
    attributes?: Deku.Attributes,
    ...children: Deku.Child[]
): Deku.Vnode {
    let key;
    const vnodeChildren = [];

    if (isNil(attributes)) {
        attributes = {};
    } else {
        key = attributes.key;

        delete attributes.key;
    }

    for (let child of children) {
        vnodeChildren.push(
            createFromChild(child)
        );
    }

    switch (typeof type) {
        case 'function': {
            return createThunk(type, attributes, vnodeChildren, key);
        }

        case 'string': {
            return createNative(type, attributes, vnodeChildren, key);
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}


function createFromChild(child: Deku.Child): Deku.Vnode {
    switch (typeof child) {
        case 'undefined': {
            throw new Error(`Child can't be undefined. Did you mean to use null?`);
        }

        case 'string': {
            return createText(child as string);
        }

        case 'number': {
            return createText(String(child));
        }

        case 'object': {
            if (isNull(child)) {
                return createEmpty();
            }

            return child as Deku.Vnode;
        }

        default: {
            return child as Deku.Vnode;
        }
    }
}


function createNative(
    tagName: string,
    attributes: Deku.Props,
    children: Deku.Vnode[],
    key?: Deku.Key
): Deku.NativeVnode {
    return {
        type: 'native',
        tagName,
        attributes,
        children,
        key
    };
}


function createThunk(
    render,
    props: Deku.Props,
    children: Deku.Vnode[],
    key?: Deku.Key
): Deku.ThunkVnode {
    return {
        type: 'thunk',
        render,
        props,
        children,
        key
    };
}


function createText(text: string): Deku.TextVnode {
    return {
        type: 'text',
        text
    };
}


function createEmpty(): Deku.EmptyVnode {
    return {
        type: 'empty'
    };
}


export function createPath(parts: (string | number)[]): string {
    return parts.join('.');
}
