import {
    isUndefined,
    isNull
} from '../utils';
import {
    Change
} from '../diff/changes';
import {
    set as setAttribute,
    remove as removeAttribute
} from './attribute';
import {
    create
} from './create';

export function update(
    DOMNode: Node | null,
    change: Change,
    ): Node | null {
    switch (change.type) {
        case 'SET_ATTRIBUTE': {
            setAttribute(
                DOMNode,
                change.attribute,
                change.nextValue,
                change.prevValue
            );
            break;
        }

        case 'REMOVE_ATTRIBUTE': {
            removeAttribute(
                DOMNode,
                change.attribute,
                change.value
            );
            break;
        }

        case 'UPDATE_CHILDREN': {
            updateChildren(DOMNode, change.changes);
            break;
        }

        case 'INSERT_BEFORE': {
            if (!isNull(DOMNode)) {
                insertAtPosition(
                    DOMNode.parentNode,
                    change.position,
                    DOMNode
                );
            }
            break;
        }

        case 'REPLACE_NODE': {
            if (!isNull(DOMNode) && !isNull(DOMNode.parentNode)) {
                const newDOMNode = create(
                    change.nextVnode,
                    change.path
                );

                DOMNode.parentNode.replaceChild(newDOMNode, DOMNode);
                DOMNode = newDOMNode;
            }
            break;
        }

        case 'REMOVE_NODE': {
            if (!isNull(DOMNode) && !isNull(DOMNode.parentNode)) {
                DOMNode.parentNode.removeChild(DOMNode);
                return null;
            }
            break;
        }
    }

    return DOMNode;
}

function updateChildren(
    DOMNode: Node | null,
    changes: Change[],
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

    for (const change of changes) {
        switch (change.type) {
            case 'INSERT_CHILD': {
                insertAtPosition(
                    DOMNode,
                    change.position,
                    create(change.vnode, change.path)
                );
                break;
            }

            case 'REMOVE_CHILD': {
                if (!isNull(DOMNode)) {
                    DOMNode.removeChild(
                        getChildNode(DOMNode, change.position)
                    );
                }
                break;
            }

            case 'UPDATE_CHILD': {
                if (!isNull(DOMNode)) {
                    for (const subChange of change.changes) {
                        update(
                            getChildNode(DOMNode, change.position),
                            subChange
                        );
                    }
                }
                break;
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
