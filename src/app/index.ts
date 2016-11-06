import { createElement, updateElement } from '../dom';
import { diffNode } from '../diff';
import { clearElement } from 'utils/clear-element';
import { noop } from 'utils/noop';
import { isNull } from 'utils/is-null';


/**
 * Create a DOM renderer using a container element. Everything will be rendered
 * inside of that container. Returns a function that accepts new state that can
 * replace what is currently rendered.
 */
export function createApp(container: HTMLElement, dispatch = noop, rootId: string = '0') {
    let oldVnode = null;
    let node = null;

    clearElement(container);

    let update = (newVnode, context) => {
        let changes = diffNode(oldVnode, newVnode, rootId);
        node = changes.reduce(updateElement(dispatch, context), node);
        oldVnode = newVnode;
        return node;
    };

    let create = (vnode, context) => {
        node = createElement(vnode, rootId, dispatch, context);
        container.appendChild(node);
        oldVnode = vnode;
        return node;
    };

    return (vnode?, context = {}) => {
        return isNull(node)
            ? create(vnode, context)
            : update(vnode, context);
    };
}
