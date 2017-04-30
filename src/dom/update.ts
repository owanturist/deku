import {
    isUndefined,
    isNull
} from 'utils';
import {
    diffVnodes
} from 'diff';
import {
    SET_ATTRIBUTE,
    REMOVE_ATTRIBUTE,
    INSERT_CHILD,
    REMOVE_CHILD,
    UPDATE_CHILD,
    UPDATE_CHILDREN,
    INSERT_BEFORE,
    REPLACE_NODE,
    REMOVE_NODE,
    UPDATE_THUNK,
    Change
} from 'diff/changes';
import {
    Context,
    concatKeys,
    Vnode,
    NATIVE,
    THUNK,
    Thunk as ThunkVnode
} from 'vnode';
import {
    set as setAttribute,
    remove as removeAttribute
} from './attribute';
import {
    create
} from './create';


export function update<P, C>(
    DOMNode: Node | null,
    change: Change<P, C>,
    context: Context<C>
    ): Node | null {
    switch (change.type) {
        case SET_ATTRIBUTE: {
            setAttribute(
                DOMNode,
                change.payload.attribute,
                change.payload.nextValue,
                change.payload.prevValue
            );
            break;
        }

        case REMOVE_ATTRIBUTE: {
            removeAttribute(
                DOMNode,
                change.payload.attribute,
                change.payload.value
            );
            break;
        }

        case UPDATE_CHILDREN: {
            updateChildren(DOMNode, change.payload, context);
            break;
        }

        case INSERT_BEFORE: {
            if (!isNull(DOMNode)) {
                insertAtPosition(
                    DOMNode.parentNode,
                    change.payload,
                    DOMNode
                );
            }
            break;
        }

        case REPLACE_NODE: {
            if (!isNull(DOMNode) && !isNull(DOMNode.parentNode)) {
                const newDOMNode = create(
                    change.payload.nextVnode,
                    change.payload.path,
                    context
                );

                DOMNode.parentNode.replaceChild(newDOMNode, DOMNode);
                DOMNode = newDOMNode;
                removeThunksAndComponents(change.payload.prevVnode);
            }
            break;
        }

        case REMOVE_NODE: {
            if (!isNull(DOMNode) && !isNull(DOMNode.parentNode)) {
                removeThunksAndComponents(change.payload);
                DOMNode.parentNode.removeChild(DOMNode);
                return null;
            }
            break;
        }

        case UPDATE_THUNK: {
            updateThunk(
                DOMNode,
                change.payload.prevThunk,
                change.payload.nextThunk,
                change.payload.path,
                context
            );
            break;
        }

        default: {
            // do nothing
        }
    }

    return DOMNode;
}


function updateChildren<P, C>(
    DOMNode: Node | null,
    changes: Change<P, C>[],
    context: Context<C>
    ): void {
    let childNodes: Node[];

    function getChildNode(node: Node, position: number): Node {
        if (isUndefined(childNodes)) {
            childNodes = [];

            const { length } = node.childNodes;

            for (let index = 0; index < length; index++) {
                childNodes[ index ] = node.childNodes.item(index);
            }
        }

        return childNodes[ position ];
    }

    for (let change of changes) {
        switch (change.type) {
            case INSERT_CHILD: {
                insertAtPosition(
                    DOMNode,
                    change.payload.position,
                    create(
                        change.payload.vnode,
                        change.payload.path,
                        context
                    )
                );
                break;
            }

            case REMOVE_CHILD: {
                if (!isNull(DOMNode)) {
                    DOMNode.removeChild(
                        getChildNode(DOMNode, change.payload)
                    );
                }
                break;
            }

            case UPDATE_CHILD: {
                if (!isNull(DOMNode)) {
                    for (let subChange of change.payload.changes) {
                        update(
                            getChildNode(DOMNode, change.payload.position),
                            subChange,
                            context
                        );
                    }
                }
                break;
            }

            default: {
                // do nothing
            }
        }
    }
}


function updateThunk<P, C>(
    DOMNode: Node | null,
    prevVnode: ThunkVnode<P, C>,
    nextVnode: ThunkVnode<P, C>,
    path: string,
    context: Context<C>
    ): Node | null {
    const { props, children } = nextVnode;
    const model = { children, props, path, context };
    const outputVnode = nextVnode.render(model);
    const changes = isUndefined(prevVnode.state) ? [] : diffVnodes(
        prevVnode.state.vnode,
        outputVnode,
        concatKeys(path, 0)
    );

    for (let change of changes) {
        DOMNode = update(DOMNode, change, context);
    }

    nextVnode.state = {
        vnode: outputVnode
    };

    return DOMNode;
}


function removeThunksAndComponents<C, P>(vnode: Vnode<C, P>): void {
    while (true) {
        switch (vnode.type) {
            case THUNK: {
                if (!isUndefined(vnode.state)) {
                    vnode = vnode.state.vnode;
                }
                continue;
            }

            case NATIVE: {
                for (let child of vnode.children) {
                    removeThunksAndComponents(child);
                }
                return;
            }

            default: {
                return;
            }
        }
    }
}


function insertAtPosition(
    parentDOMNode: Node | null,
    position: number,
    DOMNode: Node | null
    ): void {
    if (isNull(parentDOMNode) || isNull(DOMNode)) {
        return;
    }

    const refDOMNode = parentDOMNode.childNodes.item(position);

    if (isNull(refDOMNode)) {
        parentDOMNode.appendChild(DOMNode);
    } else {
        parentDOMNode.insertBefore(DOMNode, refDOMNode);
    }
}
