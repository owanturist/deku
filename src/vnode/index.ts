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


export function createNative(
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


export function createThunk(
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


export function createText(text: string): Deku.TextVnode {
    return {
        type: 'text',
        text
    };
}


export function createEmpty(): Deku.EmptyVnode {
    return {
        type: 'empty'
    };
}


export function isSameNativeVnodes(
    left: Deku.NativeVnode,
    right: Deku.NativeVnode
): boolean {
    return left.tagName === right.tagName;
}


export function isSameThunkVnodes(
    left: Deku.ThunkVnode,
    right: Deku.ThunkVnode
): boolean {
    return left.render === right.render;
}


export function isSameTextVnodes(
    left: Deku.TextVnode,
    right: Deku.TextVnode
): boolean {
    return left.text === right.text;
}


export function createPath(parts: (string | number)[]): string {
    return parts.join('.');
}


export function createNestingPath(
    vnode: Deku.Vnode,
    path: string,
    fallback: number
): string {
    switch (vnode.type) {
        case 'native':
        case 'thunk': {
            return createPath([ path, vnode.key || fallback ]);
        }

        case 'text':
        case 'empty': {
            return createPath([ path, fallback ]);
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}


export function buildKeyPatching(vnodes: Deku.Vnode[]): Deku.KeyPatching[] {
    const { length } = vnodes;

    if (length === 0) {
        return [];
    }

    const result = [];

    for (let index = 0; index < length; index++) {
        const vnode = vnodes[ index ];

        switch (vnode.type) {
            case 'native':
            case 'thunk': {
                result[ index ] = {
                    key: vnode.key || index,
                    vnode,
                    index
                };
                continue;
            }

            case 'text':
            case 'empty': {
                result[ index ] = {
                    key: index,
                    vnode,
                    index
                };
                continue;
            }

            default: {
                throw new Error('Vnode type is invalid.');
            }
        }
    }

    return result;
}


export function getKey(keyPatching: Deku.KeyPatching): Deku.Key | void {
    return keyPatching.key;
}
