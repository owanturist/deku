import { setAttribute, removeAttribute } from './setAttribute';
import { isThunk, createPath } from '../element';
import { Actions, diffNode } from '../diff';
import { reduceArray } from 'utils/reduce-array';
import { createElement } from './create';
import { toArray } from 'utils/to-array';
import { forEachArray } from 'utils/for-each-array';
import { noop } from 'utils/noop';

/**
 * Modify a DOM element given an array of actions.
 */

export function updateElement(dispatch?, context?) {
    return (DOMElement, action) => {
        Actions.case({
            sameNode: noop,
            setAttribute: (name, value, previousValue) => {
                setAttribute(DOMElement, name, value, previousValue);
            },
            removeAttribute: (name, previousValue) => {
                removeAttribute(DOMElement, name, previousValue);
            },
            insertBefore: (index) => {
                insertAtIndex(DOMElement.parentNode, index, DOMElement);
            },
            updateChildren: (changes) => {
                updateChildren(DOMElement, changes, dispatch, context);
            },
            updateThunk: (prev, next, path) => {
                DOMElement = updateThunk(DOMElement, prev, next, path, dispatch, context);
            },
            replaceNode: (prev, next, path) => {
                let newEl = createElement(next, path, dispatch, context);
                let parentEl = DOMElement.parentNode;
                if (parentEl) parentEl.replaceChild(newEl, DOMElement);
                DOMElement = newEl;
                removeThunks(prev, dispatch);
            },
            removeNode: (prev) => {
                removeThunks(prev);
                DOMElement.parentNode.removeChild(DOMElement);
                DOMElement = null;
            }
        }, action);

        return DOMElement;
    };
}

/**
 * Update all the children of a DOMElement using an array of actions
 */

function updateChildren(DOMElement, changes, dispatch, context) {
    // Create a clone of the children so we can reference them later
    // using their original position even if they move around
    let childNodes = toArray(DOMElement.childNodes);
    changes.forEach(change => {
        Actions.case({
            insertChild: (vnode, index, path) => {
                insertAtIndex(DOMElement, index, createElement(vnode, path, dispatch, context));
            },
            removeChild: (index) => {
                DOMElement.removeChild(childNodes[index]);
            },
            updateChild: (index, actions) => {
                let _update = updateElement(dispatch, context);
                actions.forEach(action => _update(childNodes[index], action));
            }
        }, change);
    });
}

/**
 * Update a thunk and only re-render the subtree if needed.
 */

function updateThunk(DOMElement, prev, next, path, dispatch, context) {
    let { props, children } = next;
    let { onUpdate } = next.options;
    let prevNode = prev.state.vnode;
    let model = {
        children,
        props,
        path,
        dispatch,
        context
    };
    let nextNode = next.fn(model);
    let changes = diffNode(prevNode, nextNode, createPath([ path, '0' ]));
    DOMElement = reduceArray(updateElement(dispatch, context), DOMElement, changes);
    if (onUpdate) dispatch(onUpdate(model));
    next.state = {
        vnode: nextNode,
        model: model
    };
    return DOMElement;
}

/**
 * Recursively remove all thunks
 */

function removeThunks(vnode, dispatch?) {
    while (isThunk(vnode)) {
        let onRemove = vnode.options.onRemove;
        let { model } = vnode.state;
        if (onRemove) dispatch(onRemove(model));
        vnode = vnode.state.vnode;
    }
    if (vnode.children) {
        forEachArray(child => removeThunks(child, dispatch), vnode.children);
    }
}

/**
 * Slightly nicer insertBefore
 */

export let insertAtIndex = (parent, index, el) => {
    let target = parent.childNodes[index];
    if (target) {
        parent.insertBefore(el, target);
    } else {
        parent.appendChild(el);
    }
};
