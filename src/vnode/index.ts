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

    buildVnodeChildren(vnodeChildren, children);

    if (isNil(attributes)) {
        attributes = {};
    } else if ('key' in attributes) {
        key = attributes.key;

        delete attributes.key;
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


function buildVnodeChildren(acc: Deku.Vnode[], children: Deku.Child[]): void {
    if (children.length === 0) {
        return;
    }

    for (let child of children) {
        switch (typeof child) {
            case 'undefined': {
                throw new Error(`Child can't be undefined. Did you mean to use null?`);
            }

            case 'string': {
                acc.push(
                    createText(child as string)
                );
                break;
            }

            case 'number': {
                acc.push(
                    createText(String(child))
                );
                break;
            }

            case 'object': {
                if (Array.isArray(child)) {
                    buildVnodeChildren(acc, child);
                } else if (isNull(child)) {
                    acc.push(createEmpty());
                } else {
                    acc.push(child as Deku.Vnode);
                }
                break;
            }

            default: {
                // do nothing
            }
        }
    }
}


export function createNative(
    tagName: string,
    attributes: Deku.Props,
    children: Deku.Vnode[],
    key: Deku.Key
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
    key: Deku.Key
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


export function concatPath(a: Deku.Key, b: Deku.Key): string {
    return `${a}.${b}`;
}


export function createNestingPath(
    vnode: Deku.Vnode,
    path: string,
    fallback: number
): string {
    switch (vnode.type) {
        case 'native':
        case 'thunk': {
            return concatPath(path, vnode.key || fallback);
        }

        case 'text':
        case 'empty': {
            return concatPath(path, fallback);
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
                break;
            }

            case 'text':
            case 'empty': {
                result[ index ] = {
                    key: index,
                    vnode,
                    index
                };
                break;
            }

            default: {
                throw new Error('Vnode type is invalid.');
            }
        }
    }

    return result;
}


export function getKey(keyPatching: Deku.KeyPatching): Deku.Key {
    return keyPatching.key;
}
