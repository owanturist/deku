import dift, { CREATE, UPDATE, MOVE, REMOVE } from 'dift';

import {
    isUndefined
} from 'utils';
import {
    NATIVE,
    COMPONENT,
    THUNK,
    TEXT,
    Vnode,
    Native as NativeVnode,
    Component as ComponentVnode,
    Thunk as ThunkVnode,
    Text as TextVnode,
    isSameNative as isSameNativeVnodes,
    isSameComponent as isSameComponentVnodes,
    isSameThunk as isSameThunkVnodes,
    isSameText as isSameTextVnodes,
    KeyPatching,
    getKey,
    concatKeys,
    buildKeyPatching
} from 'vnode';
import {
    Change,
    UpdateChildren,
    setAttribute,
    removeAttribute,
    insertChild,
    removeChild,
    updateChildren,
    insertBefore,
    replaceNode,
    removeNode,
    updateChild,
    updateThunk,
    updateComponent
} from './changes';


export function diffVnodes<P, C>(
    prevVnode: Vnode<P, C>,
    nextVnode: Vnode<P, C> | undefined,
    path: string
    ): Change<P, C>[] {
    if (isUndefined(nextVnode)) {
        return [
            removeNode(prevVnode)
        ];
    }

    if (prevVnode === nextVnode) {
        return [];
    }

    if (prevVnode.type !== nextVnode.type) {
        return [
            replaceNode(prevVnode, nextVnode, path)
        ];
    }

    switch (nextVnode.type) {
        case NATIVE: {
            if (isSameNativeVnodes(prevVnode as NativeVnode<P, C>, nextVnode)) {
                const changes = diffAttributes(prevVnode as NativeVnode<P, C>, nextVnode);
                const childChanges = diffChildren(prevVnode as NativeVnode<P, C>, nextVnode, path);

                if (childChanges.payload.length !== 0) {
                    changes.push(childChanges);
                }

                return changes;
            }

            return [
                replaceNode(prevVnode, nextVnode, path)
            ];
        }

        case COMPONENT: {
            if (isSameComponentVnodes(prevVnode as ComponentVnode<P, C>, nextVnode)) {
                return [
                    updateComponent(prevVnode as ComponentVnode<P, C>, nextVnode, path)
                ];
            }

            return [
                replaceNode(prevVnode, nextVnode, path)
            ];
        }

        case THUNK: {
            if (isSameThunkVnodes(prevVnode as ThunkVnode<P, C>, nextVnode)) {
                return [
                    updateThunk(prevVnode as ThunkVnode<P, C>, nextVnode, path)
                ];
            }

            return [
                replaceNode(prevVnode, nextVnode, path)
            ];
        }

        case TEXT: {
            if (isSameTextVnodes(prevVnode as TextVnode, nextVnode)) {
                return [];
            }

            return [
                setAttribute('nodeValue', nextVnode.text, (prevVnode as TextVnode).text)
            ];
        }

        default: {
            return [];
        }
    }
}


export function diffAttributes<P, C>(
    prevVnode: NativeVnode<P, C>,
    nextVnode: NativeVnode<P, C>
    ): Change<P, C>[] {
    const prevAttrs = prevVnode.attributes;
    const nextAttrs = nextVnode.attributes;
    const changes = [];

    for (let name in nextAttrs) {
        if (nextAttrs[ name ] !== prevAttrs[ name ]) {
            changes.push(
                setAttribute(name, nextAttrs[ name ], prevAttrs[ name ])
            );
        }
    }

    for (let name in prevAttrs) {
        if (!nextAttrs.hasOwnProperty(name)) {
            changes.push(
                removeAttribute(name, prevAttrs[ name ])
            );
        }
    }

    return changes;
}


export function diffChildren<P, C>(
    prevVnode: NativeVnode<P, C>,
    nextVnode: NativeVnode<P, C>,
    parentPath: string
    ): UpdateChildren<P, C> {
    const prevChildren = prevVnode.children;
    const nextChildren = nextVnode.children;
    const changes = [];

    dift(
        buildKeyPatching(prevChildren),
        buildKeyPatching(nextChildren),
        (
            type: number,
            prev: KeyPatching<P, C>,
            next?: KeyPatching<P, C>,
            position?: number
        ): void => {
            switch (type) {
                case CREATE: {
                    changes.push(
                        insertChild(
                            next.vnode,
                            position,
                            concatKeys(parentPath, next.key)
                        )
                    );

                    break;
                }

                case UPDATE: {
                    const childChanges = diffVnodes(
                        prev.vnode,
                        next.vnode,
                        concatKeys(parentPath, next.key)
                    );

                    if (childChanges.length !== 0) {
                        changes.push(
                            updateChild(prev.position, childChanges)
                        );
                    }

                    break;
                }

                case MOVE: {
                    const childChanges = diffVnodes(
                        prev.vnode,
                        next.vnode,
                        concatKeys(parentPath, next.key)
                    );
                    childChanges.push(
                        insertBefore(position)
                    );
                    changes.push(
                        updateChild(prev.position, childChanges)
                    );

                    break;
                }

                case REMOVE: {
                    changes.push(
                        removeChild(prev.position)
                    );

                    break;
                }

                default: {
                    // do nothing
                }
            }
        },
        getKey
    );

    return updateChildren<P, C>(changes);
}

