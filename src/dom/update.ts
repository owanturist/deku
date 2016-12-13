import {
    isUndefined
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
    UPDATE_COMPONENT,
    Change
} from 'diff/changes';
import {
    concatKeys,
    Vnode,
    NATIVE,
    COMPONENT,
    THUNK,
    Component as ComponentVnode,
    Thunk as ThunkVnode
} from 'vnode';
import {
    set as setAttribute,
    remove as removeAttribute
} from './attribute';
import {
    create
} from './create';


export function update(
    DOMNode: Node,
    change: Change,
    dispatch: any,
    context: any
    ): Node {
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
            updateChildren(DOMNode, change.payload, dispatch, context);
            break;
        }

        case INSERT_BEFORE: {
            insertAtPosition(
                DOMNode.parentNode,
                change.payload,
                DOMNode
            );
            break;
        }

        case REPLACE_NODE: {
            const newDOMNode = create(
                change.payload.nextVnode,
                change.payload.path,
                dispatch,
                context
            );

            DOMNode.parentNode.replaceChild(newDOMNode, DOMNode);
            DOMNode = newDOMNode;
            removeThunksAndComponents(change.payload.prevVnode);
            break;
        }

        case REMOVE_NODE: {
            removeThunksAndComponents(change.payload);
            DOMNode.parentNode.removeChild(DOMNode);
            DOMNode = null;
            break;
        }

        case UPDATE_THUNK: {
            updateThunk(
                DOMNode,
                change.payload.prevThunk,
                change.payload.nextThunk,
                change.payload.path,
                dispatch,
                context
            );
            break;
        }

        case UPDATE_COMPONENT: {
            updateComponent(
                DOMNode,
                change.payload.prevThunk,
                change.payload.nextThunk,
                change.payload.path,
                dispatch,
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


function updateChildren(
    DOMNode: Node,
    changes: Change[],
    dispatch: any,
    context: any
    ): void {
    let childNodes: Node[];

    function getChildNode(position: number): Node {
        if (isUndefined(childNodes)) {
            childNodes = [];

            const { length } = DOMNode.childNodes;

            for (let index = 0; index < length; index++) {
                childNodes[ index ] = DOMNode.childNodes.item(index);
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
                        dispatch,
                        context
                    )
                );
                break;
            }

            case REMOVE_CHILD: {
                DOMNode.removeChild(
                    getChildNode(change.payload)
                );
                break;
            }

            case UPDATE_CHILD: {
                for (let subChange of change.payload.changes) {
                    update(
                        getChildNode(change.payload.position),
                        subChange,
                        dispatch,
                        context
                    );
                }
                break;
            }

            default: {
                // do nothing
            }
        }
    }
}


function updateComponent(
    DOMNode: Node,
    prevVnode: ComponentVnode,
    nextVnode: ComponentVnode,
    path: string,
    dispatch: any,
    context: any
    ): Node {
    const { props, children } = nextVnode;
    const model = { children, props, path, dispatch, context };
    const outputVnode = nextVnode.render(model);
    const changes = diffVnodes(
        prevVnode.state.vnode,
        outputVnode,
        concatKeys(path, 0)
    );

    for (let change of changes) {
        DOMNode = update(DOMNode, change, dispatch, context);
    }

    nextVnode.onUpdate(model);
    nextVnode.state = {
        vnode: outputVnode,
        model
    };

    return DOMNode;
}


function updateThunk(
    DOMNode: Node,
    prevVnode: ThunkVnode,
    nextVnode: ThunkVnode,
    path: string,
    dispatch: any,
    context: any
    ): Node {
    const { props, children } = nextVnode;
    const model = { children, props, path, dispatch, context };
    const outputVnode = nextVnode.render(model);
    const changes = diffVnodes(
        prevVnode.state.vnode,
        outputVnode,
        concatKeys(path, 0)
    );

    for (let change of changes) {
        DOMNode = update(DOMNode, change, dispatch, context);
    }

    nextVnode.state = {
        vnode: outputVnode
    };

    return DOMNode;
}


function removeThunksAndComponents(vnode: Vnode): void {
    while (true) {
        switch (vnode.type) {
            case COMPONENT: {
                vnode.onUnmount(vnode.state.model);
                vnode = vnode.state.vnode;
                continue;
            }

            case THUNK: {
                vnode = vnode.state.vnode;
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
    parentDOMNode: Node,
    position: number,
    DOMNode: Node
    ): void {
    const refDOMNode = parentDOMNode.childNodes.item(position);

    if (refDOMNode) {
        parentDOMNode.insertBefore(DOMNode, refDOMNode);
    } else {
        parentDOMNode.appendChild(DOMNode);
    }
}
