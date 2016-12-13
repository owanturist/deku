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


export function diffVnodes(
    prevVnode: Vnode,
    nextVnode: Vnode | undefined,
    path: string
    ): Change[] {
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
            if (isSameNativeVnodes(prevVnode as NativeVnode, nextVnode)) {
                const changes = diffAttributes(prevVnode as NativeVnode, nextVnode);
                const childChanges = diffChildren(prevVnode as NativeVnode, nextVnode, path);

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
            if (isSameComponentVnodes(prevVnode as ComponentVnode, nextVnode)) {
                return [
                    updateComponent(prevVnode as ComponentVnode, nextVnode, path)
                ];
            }

            return [
                replaceNode(prevVnode, nextVnode, path)
            ];
        }

        case THUNK: {
            if (isSameThunkVnodes(prevVnode as ThunkVnode, nextVnode)) {
                return [
                    updateThunk(prevVnode as ThunkVnode, nextVnode, path)
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


export function diffAttributes(
    prevVnode: NativeVnode,
    nextVnode: NativeVnode
    ): Change[] {
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


export function diffChildren(
    prevVnode: NativeVnode,
    nextVnode: NativeVnode,
    parentPath: string
    ): UpdateChildren {
    const prevChildren = prevVnode.children;
    const nextChildren = nextVnode.children;
    const changes = [];

    dift(
        buildKeyPatching(prevChildren),
        buildKeyPatching(nextChildren),
        (
            type: number,
            prev: KeyPatching,
            next?: KeyPatching,
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

    return updateChildren(changes);
}

