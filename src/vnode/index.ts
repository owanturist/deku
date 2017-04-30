import {
    noop,
    isUndefined,
    isNil,
    isNull
} from 'utils';


export type Key
    = string
    | number

export type Props<P> = {} & P;

export type Context<C> = {} & C;

export type Attributes<P> = Props<P> & {
    key?: Key
}

export type Model<P, C> = {
    readonly children: Vnode<P, C>[],
    readonly props: Props<P>,
    readonly context: Context<C>
    readonly path: string,
}

export type Render<P, C> = (model: Model<P, C>) => Vnode<P, C>

type Child<P, C>
    = null
    | string
    | number
    | boolean
    | Vnode<P, C>
    | ArrayOfChildren<P, C>

interface ArrayOfChildren<P, C> extends Array<Child<P, C>> {}

export type KeyPatching<P, C> = {
    readonly vnode: Vnode<P, C>,
    readonly position: number,
    readonly key: Key
}

export type Vnode<P, C>
    = Native<P, C>
    | Thunk<P, C>
    | Text
    | Empty


export type NATIVE = 'VNODE/NATIVE';
export const NATIVE: NATIVE = 'VNODE/NATIVE';
export type Native<P, C> = {
    readonly type: NATIVE,
    readonly tagName: string,
    readonly attributes: Attributes<P>,
    readonly children: Vnode<P, C>[],
    readonly key?: Key
}

export function createNative<P, C>(
    tagName: string,
    attributes: Attributes<P>,
    children: Vnode<P, C>[],
    key?: Key
    ): Native<P, C> {
    return {
        type: NATIVE,
        tagName,
        attributes,
        children,
        key
    };
}

export function isSameNative<P, C>(
    leftVnode: Native<P, C>,
    rightVnode: Native<P, C>
    ): boolean {
    return leftVnode.tagName === rightVnode.tagName;
}


export type THUNK = 'VNODE/THUNK';
export const THUNK: THUNK = 'VNODE/THUNK';
export type Thunk<P, C> = {
    readonly type: THUNK,
    readonly render: Render<P, C>,
    readonly props: Props<P>,
    readonly children: Vnode<P, C>[],
    readonly key?: Key,
    state?: {
        readonly vnode: Vnode<P, C>
    }
}

export function createThunk<P, C>(
    render: Render<P, C>,
    props: Props<P>,
    children: Vnode<P, C>[],
    key?: Key
    ): Thunk<P, C> {
    return {
        type: THUNK,
        render,
        props,
        children,
        key
    };
}

export function isSameThunk<P, C>(
    leftVnode: Thunk<P, C>,
    rightVnode: Thunk<P, C>
    ): boolean {
    return leftVnode.render === rightVnode.render;
}


export type TEXT = 'VNODE/TEXT';
export const TEXT: TEXT = 'VNODE/TEXT';
export type Text = {
    readonly type: TEXT,
    readonly text: string
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
    readonly type: EMPTY
}

export function createEmpty(): Empty {
    return {
        type: EMPTY
    };
}

export function create<P, C>(
    config: string | Render<P, C>,
    attributes?: Attributes<P>,
    ...children: Child<P, C>[]
    ): Vnode<P, C> {
    let key;
    const vnodeChildren = [];

    buildVnodeChildren<P, C>(vnodeChildren, children);

    if (isNil(attributes)) {
        attributes = {} as P;
    } else if (!isUndefined(attributes.key)) {
        key = attributes.key;

        delete attributes.key;
    }

    switch (typeof config) {
        case 'string': {
            return createNative<P, C>(
                config as string,
                attributes,
                vnodeChildren,
                key
            );
        }

        case 'function': {
            return createThunk<P, C>(
                config as Render<P, C>,
                attributes,
                vnodeChildren,
                key
            );
        }

        default: {
            throw new Error('Vnode type is invalid.');
        }
    }
}


function buildVnodeChildren<P, C>(
    acc: Vnode<P, C>[],
    children: Child<P, C>[]
    ): void {
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
                    buildVnodeChildren<P, C>(acc, child);
                } else if (isNull(child)) {
                    acc.push(
                        createEmpty()
                    );
                } else {
                    acc.push(child as Vnode<P, C>);
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


export function concatPaths<P, C>(
    path: string,
    vnode: Vnode<P, C>,
    fallback: Key
    ): string {
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


export function createKeyPatching<P, C>(
    vnode: Vnode<P, C>,
    position: number
    ): KeyPatching<P, C> {
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


export function buildKeyPatching<P, C>(
    vnodes: Vnode<P, C>[]
    ): KeyPatching<P, C>[] {
    const { length } = vnodes;

    if (length === 0) {
        return [];
    }

    const result: KeyPatching<P, C>[] = [];

    for (let index = 0; index < length; index++) {
        result[ index ] = createKeyPatching(vnodes[ index ], index);
    }

    return result;
}


export function getKey<P, C>(keyPatching: KeyPatching<P, C>): Key {
    return keyPatching.key;
}
