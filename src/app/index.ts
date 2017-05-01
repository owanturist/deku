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
    Vnode
} from 'vnode';
import {
    isNull
} from 'utils';

export function create(container: HTMLElement | null, rootId = '0') {
    let prevVnode: Vnode;
    let DOMNode: Node | null = null;

    function createAppDOM(vnode: Vnode): Node | null {
        DOMNode = createDOM(vnode, rootId);
        if (!isNull(container)) {
            container.appendChild(DOMNode);
        }
        prevVnode = vnode;

        return DOMNode;
    }

    function updateAppDOM(nextVnode: Vnode): Node | null {
        const changes = diffVnodes(prevVnode, nextVnode, rootId);

        for (const change of changes) {
            DOMNode = updateDOM(DOMNode, change);
        }

        prevVnode = nextVnode;

        return DOMNode;
    }

    return (vnode: Vnode): Node | null => {
        return isNull(DOMNode) ?
            createAppDOM(vnode) :
            updateAppDOM(vnode);
    };
}
