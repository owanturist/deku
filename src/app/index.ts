import {
    create as createDOM
} from 'dom/create';
import {
    update as updateDOM
} from 'dom/update';
import {
    diffVnodes
} from 'diff';
import {
    Context,
    Vnode
} from 'vnode';
import {
    isNull
} from 'utils';

export function create<P, C>(container: HTMLElement | null, rootId = '0') {
    let prevVnode: Vnode<P, C>;
    let DOMNode: Node | null = null;

    function createAppDOM(vnode: Vnode<P, C>, context: Context<C>): Node | null {
        DOMNode = createDOM(vnode, rootId, context);
        if (!isNull(container)) {
            container.appendChild(DOMNode);
        }
        prevVnode = vnode;

        return DOMNode;
    }

    function updateAppDOM(nextVnode: Vnode<P, C>, context: Context<C>): Node | null {
        const changes = diffVnodes(prevVnode, nextVnode, rootId);

        for (let change of changes) {
            DOMNode = updateDOM(DOMNode, change, context);
        }

        prevVnode = nextVnode;

        return DOMNode;
    }

    return (vnode: Vnode<P, C>, context: Context<C>): Node | null => {
        return isNull(DOMNode) ?
            createAppDOM(vnode, context) :
            updateAppDOM(vnode, context);
    };
}
