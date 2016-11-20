import Deku from 'types';
import dift, { CREATE, UPDATE, MOVE, REMOVE } from 'dift';

import {
    isUndefined,
    isNull
} from 'utils';
import {
    isSameNativeVnodes,
    isSameThunkVnodes,
    isSameTextVnodes,
    getKey,
    concatPath,
    buildKeyPatching
} from 'vnode';
import {
    setAttribute,
    removeAttribute,
    insertChild,
    removeChild,
    updateChildren,
    replaceNode,
    removeNode,
    updateChild,
    updateThunk,
    insertBefore
} from './actions';


export function diffVnodes(
    prevVnode: Deku.Vnode | void,
    nextVnode: Deku.Vnode | void,
    path: string
): Deku.DiffAction[] {
    if (isUndefined(prevVnode)) {
        throw new Error('Left node must not be null or undefined');
    }

    if (isUndefined(nextVnode)) {
        return [
            removeNode(prevVnode)
        ];
    }

    if (prevVnode === nextVnode) {
        return [];
    }

    const prevNullable = isNull(prevVnode);
    const nextNullable = isNull(nextVnode);

    if (
        !prevNullable && nextNullable ||
        prevNullable && !nextNullable ||
        prevVnode.type !== nextVnode.type
    ) {
        return [
            replaceNode(prevVnode, nextVnode, path)
        ];
    }

    switch (nextVnode.type) {
        case 'native': {
            if (isSameNativeVnodes(prevVnode as Deku.NativeVnode, nextVnode)) {
                const changes = diffAttributes(prevVnode as Deku.NativeVnode, nextVnode);

                changes.push(
                    diffChildren(prevVnode as Deku.NativeVnode, nextVnode, path)
                );

                return changes;
            }

            return [
                replaceNode(prevVnode, nextVnode, path)
            ];
        }

        case 'thunk': {
            if (isSameThunkVnodes(prevVnode as Deku.ThunkVnode, nextVnode)) {
                return [
                    updateThunk(prevVnode as Deku.ThunkVnode, nextVnode, path)
                ];
            }

            return [
                replaceNode(prevVnode, nextVnode, path)
            ];
        }

        case 'text': {
            if (isSameTextVnodes(prevVnode as Deku.TextVnode, nextVnode)) {
                return [];
            }

            return [
                setAttribute('nodeValue', nextVnode.text, (prevVnode as Deku.TextVnode).text)
            ];
        }

        case 'empty':
        default: {
            return [];
        }
    }
}


export function diffAttributes(
    prevVnode: Deku.NativeVnode,
    nextVnode: Deku.NativeVnode
): Deku.DiffAction[] {
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
    prevVnode: Deku.NativeVnode,
    nextVnode: Deku.NativeVnode,
    parentPath: string
): Deku.DiffAction {
    const prevChildren = prevVnode.children;
    const nextChildren = nextVnode.children;
    const changes = [];

    dift(
        buildKeyPatching(prevChildren),
        buildKeyPatching(nextChildren),
        (
            type: string,
            prev: Deku.KeyPatching,
            next?: Deku.KeyPatching,
            position?: number
        ): void => {
            switch (type) {
                case CREATE: {
                    changes.push(
                        insertChild(
                            next.vnode,
                            position,
                            concatPath(parentPath, next.key)
                        )
                    );

                    break;
                }

                case UPDATE: {
                    const childChanges = diffVnodes(
                        prev.vnode,
                        next.vnode,
                        concatPath(parentPath, next.key)
                    );

                    if (childChanges.length !== 0) {
                        changes.push(
                            updateChild(prev.index, childChanges)
                        );
                    }

                    break;
                }

                case MOVE: {
                    const childChanges = diffVnodes(
                        prev.vnode,
                        next.vnode,
                        concatPath(parentPath, next.key)
                    );
                    childChanges.push(
                        insertBefore(position)
                    );
                    changes.push(
                        updateChild(prev.index, childChanges)
                    );

                    break;
                }

                case REMOVE: {
                    changes.push(
                        removeChild(prev.index)
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

