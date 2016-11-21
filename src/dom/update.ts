import Deku from 'types';

import {
    diffVnodes
} from 'diff';
import {
    concatPath,
    isThunk,
    isNative
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
    change: Deku.DiffAction,
    dispatch: any,
    context: any
): Node {
    switch (change.type) {
        case 'SET_ATTRIBUTE': {
            setAttribute(
                DOMNode,
                change.payload.attribute,
                change.payload.nextValue,
                change.payload.prevValue
            );
            break;
        }

        case 'REMOVE_ATTRIBUTE': {
            removeAttribute(
                DOMNode,
                change.payload.attribute,
                change.payload.value
            );
            break;
        }

        case 'UPDATE_CHILDREN': {
            updateChildren(DOMNode, change.payload, dispatch, context);
            break;
        }

        case 'INSERT_BEFORE': {
            insertAtPosition(
                DOMNode.parentNode,
                change.payload,
                DOMNode
            );
            break;
        }

        case 'REPLACE_NODE': {
            const newDOMNode = create(
                change.payload.nextVnode,
                change.payload.path,
                dispatch,
                context
            );

            DOMNode.parentNode.replaceChild(newDOMNode, DOMNode);
            DOMNode = newDOMNode;
            removeThunks(change.payload.prevVnode, dispatch);
            break;
        }

        case 'REMOVE_NODE': {
            removeThunks(change.payload, dispatch);
            DOMNode.parentNode.removeChild(DOMNode);
            DOMNode = null;
            break;
        }

        case 'UPDATE_THUNK': {
            updateThunk(
                DOMNode,
                change.payload.prevVnode,
                change.payload.nextVnode,
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
    changes: Deku.DiffAction[],
    dispatch: any,
    context: any
): void {
    const childNodes = [];
    const { length } = DOMNode.childNodes;

    for (let index = 0; index < length; index++) {
        childNodes[ index ] = DOMNode.childNodes.item(index);
    }

    for (let change of changes) {
        switch (change.type) {
            case 'INSERT_CHILD': {
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

            case 'REMOVE_CHILD': {
                DOMNode.removeChild(
                    childNodes[ change.payload ]
                );
                break;
            }

            case 'UPDATE_CHILD': {
                for (let subChange of change.payload.changes) {
                    update(
                        childNodes[ change.payload.index ],
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


function updateThunk(
    DOMNode: Node,
    prevVnode: Deku.ThunkVnode,
    nextVnode: Deku.ThunkVnode,
    path: string,
    dispatch: any,
    context: any
): Node {
    const { props, children } = nextVnode;
    const model = { children, props, path, dispatch, context };
    const vnode = nextVnode.render(model);
    const changes = diffVnodes(
        prevVnode.state.vnode,
        vnode,
        concatPath(path, 0)
    );

    for (let change of changes) {
        DOMNode = update(DOMNode, change, dispatch, context);
    }

    nextVnode.state = { vnode, model };

    return DOMNode;
}


function removeThunks(vnode: Deku.Vnode, dispatch: any): void {
    while (isThunk(vnode)) {
        vnode = vnode.state.vnode;
    }

    if (isNative(vnode) && vnode.children.length !== 0) {
        for (let child of vnode.children) {
            removeThunks(child, dispatch);
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
