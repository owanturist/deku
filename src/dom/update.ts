import Deku from 'types';

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
            break;
        }

        case 'REMOVE_NODE': {
            DOMNode.parentNode.removeChild(DOMNode);
            DOMNode = null;
            break;
        }

        case 'UPDATE_THUNK': {
            break;
        }

        default: {
            // do nothing
        }
    }

    return DOMNode;
}


export function updateChildren(
    DOMNode: Node,
    changes: Deku.DiffAction[],
    dispatch: any,
    context: any
): void {
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
                    DOMNode.childNodes.item(change.payload)
                );
                break;
            }

            case 'UPDATE_CHILD': {
                for (let subChange of change.payload.changes) {
                    update(
                        DOMNode.childNodes.item(change.payload.index),
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
