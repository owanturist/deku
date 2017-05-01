import dift, { CREATE, UPDATE, MOVE, REMOVE } from 'dift';

import {
    isUndefined
} from '../utils';
import {
    Vnode,
    Native,
    Text,
    isSameNative,
    isSameText,
    KeyPatching,
    buildKeyPatchings,
    getKey,
    concatPaths
} from '../vnode';
import {
    Change,
    SetAttribute,
    RemoveAttribute,
    InsertChild,
    RemoveChild,
    UpdateChildren,
    InsertBefore,
    ReplaceNode,
    RemoveNode,
    UpdateChild
} from './changes';

export function diffVnodes(
    prevVnode: Vnode,
    nextVnode: Vnode | undefined,
    path: string
    ): Change[] {
    if (isUndefined(nextVnode)) {
        return [
            RemoveNode(prevVnode)
        ];
    }

    if (prevVnode === nextVnode) {
        return [];
    }

    if (prevVnode.type !== nextVnode.type) {
        return [
            ReplaceNode(prevVnode, nextVnode, path)
        ];
    }

    switch (nextVnode.type) {
        case 'NATIVE': {
            if (isSameNative(prevVnode as Native, nextVnode)) {
                const changes = diffAttributes(prevVnode as Native, nextVnode);
                const childChanges = diffChildren(prevVnode as Native, nextVnode, path);

                if (childChanges.changes.length !== 0) {
                    changes.push(childChanges);
                }

                return changes;
            }

            return [
                ReplaceNode(prevVnode, nextVnode, path)
            ];
        }

        case 'TEXT': {
            if (isSameText(prevVnode as Text, nextVnode)) {
                return [];
            }

            return [
                SetAttribute('nodeValue', nextVnode.text, (prevVnode as Text).text)
            ];
        }
    }
}

export function diffAttributes(
    prevVnode: Native,
    nextVnode: Native
    ): Change[] {
    const prevAttrs = prevVnode.attributes;
    const nextAttrs = nextVnode.attributes;
    const changes: Change[] = [];

    for (const name in nextAttrs) {
        if (nextAttrs[ name ] !== prevAttrs[ name ]) {
            changes.push(
                SetAttribute(name, nextAttrs[ name ], prevAttrs[ name ])
            );
        }
    }

    for (const name in prevAttrs) {
        if (!nextAttrs.hasOwnProperty(name)) {
            changes.push(
                RemoveAttribute(name, prevAttrs[ name ])
            );
        }
    }

    return changes;
}

export function diffChildren(
    prevVnode: Native,
    nextVnode: Native,
    parentPath: string
    ): UpdateChildren {
    const prevChildren = prevVnode.children;
    const nextChildren = nextVnode.children;
    const changes: Change[] = [];

    dift(
        buildKeyPatchings(prevChildren),
        buildKeyPatchings(nextChildren),
        (
            type: number,
            prev: KeyPatching,
            next: KeyPatching,
            position: number
        ): void => {
            switch (type) {
                case CREATE: {
                    changes.push(
                        InsertChild(
                            next.vnode,
                            position,
                            concatPaths(parentPath, next.key)
                        )
                    );

                    break;
                }

                case UPDATE: {
                    const childChanges = diffVnodes(
                        prev.vnode,
                        next.vnode,
                        concatPaths(parentPath, next.key)
                    );

                    if (childChanges.length !== 0) {
                        changes.push(
                            UpdateChild(prev.key, childChanges)
                        );
                    }

                    break;
                }

                case MOVE: {
                    const childChanges = diffVnodes(
                        prev.vnode,
                        next.vnode,
                        concatPaths(parentPath, next.key)
                    );
                    childChanges.push(
                        InsertBefore(position)
                    );
                    changes.push(
                        UpdateChild(prev.key, childChanges)
                    );

                    break;
                }

                case REMOVE: {
                    changes.push(
                        RemoveChild(prev.key)
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

    return UpdateChildren(changes);
}
