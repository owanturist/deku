import {
    noop,
    isNil,
    isNull
} from 'utils';


export type Key
    = string
    | number

export type Props = {};

export type Attributes = Props & {
    key?: Key
}

export type Model = {
    children: Vnode[],
    props: Props,
    path: string,
    dispatch: any,
    context: any
}

export type State = {
    vnode: Vnode,
    model: Model
}

export type Render = (model: Model) => Vnode

export type Hook = (model: Model) => void

export type Lifecycle = {
    onMount: Hook,
    onUpdate: Hook,
    onUnmount: Hook
}

export type Component = Lifecycle & {
    render: Render
}

export type Config
    = string
    | Render
    | Component

type Child
    = null
    | string
    | number
    | boolean
    | Vnode
    | ArrayOfChildren

interface ArrayOfChildren extends Array<Child> {}

export type KeyPatching = {
    vnode: Vnode,
    position: number,
    key: Key
}

export type Vnode
    = Native
    | Thunk
    | Text
    | Empty


export type NATIVE = 'VNODE/NATIVE';
export const NATIVE: NATIVE = 'VNODE/NATIVE';
export type Native = {
    type: NATIVE,
    tagName: string,
    attributes: Attributes,
    children: Vnode[],
    key: Key
}

export function createNative(
    tagName: string,
    attributes: Attributes,
    children: Vnode[],
    key: Key
    ): Native {
    return {
        type: NATIVE,
        tagName,
        attributes,
        children,
        key
    };
}

export function isSameNative(leftVnode: Native, rightVnode: Native): boolean {
    return leftVnode.tagName === rightVnode.tagName;
}

export function isNative(vnode: Vnode): vnode is Native {
    return vnode.type === NATIVE;
}


export type THUNK = 'VNODE/THUNK';
export const THUNK: THUNK = 'VNODE/THUNK';
export type Thunk = Lifecycle & {
    type: THUNK,
    render: Render,
    props: Props,
    children: Vnode[],
    key: Key,
    state?: State
}

export function createThunk(
    render: Render,
    props: Props,
    children: Vnode[],
    key: Key,
    onMount: Hook = noop,
    onUpdate: Hook = noop,
    onUnmount: Hook = noop
    ): Thunk {
    return {
        type: THUNK,
        render,
        props,
        children,
        key,
        onMount,
        onUpdate,
        onUnmount
    };
}

export function isSameThunk(leftVnode: Thunk, rightVnode: Thunk): boolean {
    return leftVnode.render === rightVnode.render;
}

export function isThunk(vnode: Vnode): vnode is Thunk {
    return vnode.type === THUNK;
}


export type TEXT = 'VNODE/TEXT';
export const TEXT: TEXT = 'VNODE/TEXT';
export type Text = {
    type: TEXT,
    text: string
}

export function createText(text: string): Text {
    return {
        type: TEXT,
        text
    };
}

export function isSameText(leftVnode: Text, rightVnode: Text): boolean {
    return leftVnode.text === rightVnode.text;
}


export type EMPTY = 'VNODE/EMPTY';
export const EMPTY: EMPTY = 'VNODE/EMPTY';
export type Empty = {
    type: EMPTY
}

export function createEmpty(): Empty {
    return {
        type: EMPTY
    };
}


export function create(
    config: Config,
    attributes?: Attributes,
    ...children: Child[]
    ): Vnode {
    let key: Key;
    const vnodeChildren = [];

    buildVnodeChildren(vnodeChildren, children);

    if (isNil(attributes)) {
        attributes = {};
    } else if ('key' in attributes) {
        key = attributes.key;

        delete attributes.key;
    }

    switch (typeof config) {
        case 'string': {
            return createNative(
                config as string,
                attributes,
                vnodeChildren,
                key
            );
        }

        case 'function': {
            return createThunk(
                config as Render,
                attributes,
                vnodeChildren,
                key
            );
        }

        case 'object': {
            return createThunk(
                (config as Component).render,
                attributes,
                vnodeChildren,
                key,
                (config as Component).onMount,
                (config as Component).onUpdate,
                (config as Component).onUnmount
            );
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}


function buildVnodeChildren(acc: Vnode[], children: Child[]): void {
    if (children.length === 0) {
        return;
    }

    for (let child of children) {
        switch (typeof child) {
            case 'undefined': {
                throw new Error(
                    `Child can't be undefined. Did you mean to use null?`
                );
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
                    acc.push(
                        createEmpty()
                    );
                } else {
                    acc.push(child as Vnode);
                }
                break;
            }

            default: {
                // do nothing
            }
        }
    }
}


export function concatKeys(leftKey: Key, rightKey: Key): string {
    return `${leftKey}.${rightKey}`;
}


export function concatPaths(path: string, vnode: Vnode, fallback: Key): string {
    switch (vnode.type) {
        case NATIVE:
        case THUNK: {
            return concatKeys(path, vnode.key || fallback);
        }

        case TEXT:
        case EMPTY: {
            return concatKeys(path, fallback);
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}


export function createKeyPatching(vnode: Vnode, position: number): KeyPatching {
    switch (vnode.type) {
        case NATIVE:
        case THUNK: {
            return {
                vnode,
                position,
                key: vnode.key || position
            };
        }

        case TEXT:
        case EMPTY: {
            return {
                vnode,
                position,
                key: position
            };
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}


export function buildKeyPatching(vnodes: Vnode[]): KeyPatching[] {
    const { length } = vnodes;

    if (length === 0) {
        return [];
    }

    const result = [];

    for (let index = 0; index < length; index++) {
        result[ index ] = createKeyPatching(vnodes[ index ], index);
    }

    return result;
}


export function getKey(keyPatching: KeyPatching): Key {
    return keyPatching.key;
}
