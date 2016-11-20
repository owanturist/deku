import Deku from 'types';

export function setAttribute(
    attribute: string,
    nextValue: any,
    prevValue: any
): Deku.DiffAction {
    return {
        type: 'SET_ATTRIBUTE',
        payload: { attribute, nextValue, prevValue }
    };
}

export function removeAttribute(
    attribute: string,
    value: any
): Deku.DiffAction {
    return {
        type: 'REMOVE_ATTRIBUTE',
        payload: { attribute, value }
    };
}

export function insertChild(
    vnode: Deku.Vnode,
    position: number,
    path: string
): Deku.DiffAction {
    return {
        type: 'INSERT_CHILD',
        payload: { vnode, position, path }
    };
}

export function removeChild(
    index: number
): Deku.DiffAction {
    return {
        type: 'REMOVE_CHILD',
        payload: index
    };
}

export function updateChild(
    index: number,
    changes: Deku.DiffAction[]
): Deku.DiffAction {
    return {
        type: 'UPDATE_CHILD',
        payload: { index, changes }
    };
}

export function updateChildren(
    changes: Deku.DiffAction[]
): Deku.DiffAction {
    return {
        type: 'UPDATE_CHILDREN',
        payload: changes
    };
}

export function insertBefore(
    position: number
): Deku.DiffAction {
    return {
        type: 'INSERT_BEFORE',
        payload: position
    };
}

export function replaceNode(
    prevVnode: Deku.Vnode | void,
    nextVnode: Deku.Vnode | void,
    path: string
): Deku.DiffAction {
    return {
        type: 'REPLACE_NODE',
        payload: { prevVnode, nextVnode, path }
    };
}

export function removeNode(
    vnode: Deku.Vnode | void
): Deku.DiffAction {
    return {
        type: 'REMOVE_NODE',
        payload: { vnode }
    };
}

export function updateThunk(
    prevVnode: Deku.ThunkVnode,
    nextVnode: Deku.ThunkVnode,
    path: string
): Deku.DiffAction {
    return {
        type: 'UPDATE_THUNK',
        payload: { prevVnode, nextVnode, path }
    };
}

export function sameNode(): Deku.DiffAction {
    return {
        type: 'SAME_NODE'
    };
}
