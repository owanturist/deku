import Deku from 'types';

export function setAttribute(
    attribute: string,
    nextValue: any,
    prevValue: any
): Deku.SetAttributeAction {
    return {
        type: 'SET_ATTRIBUTE',
        payload: { attribute, nextValue, prevValue }
    };
}

export function removeAttribute(
    attribute: string,
    value: any
): Deku.RemoveAttributeAction {
    return {
        type: 'REMOVE_ATTRIBUTE',
        payload: { attribute, value }
    };
}

export function insertChild(
    vnode: Deku.Vnode,
    position: number,
    path: string
): Deku.InsertChildAction {
    return {
        type: 'INSERT_CHILD',
        payload: { vnode, position, path }
    };
}

export function removeChild(
    index: number
): Deku.RemoveChildAction {
    return {
        type: 'REMOVE_CHILD',
        payload: index
    };
}

export function updateChild(
    index: number,
    changes: Deku.DiffAction[]
): Deku.UpdateChildAction {
    return {
        type: 'UPDATE_CHILD',
        payload: { index, changes }
    };
}

export function updateChildren(
    changes: Deku.DiffAction[]
): Deku.UpdateChildrenAction {
    return {
        type: 'UPDATE_CHILDREN',
        payload: changes
    };
}

export function insertBefore(
    position: number
): Deku.InsertBeforeAction {
    return {
        type: 'INSERT_BEFORE',
        payload: position
    };
}

export function replaceNode(
    prevVnode: Deku.Vnode,
    nextVnode: Deku.Vnode,
    path: string
): Deku.ReplaceNodeAction {
    return {
        type: 'REPLACE_NODE',
        payload: { prevVnode, nextVnode, path }
    };
}

export function removeNode(
    vnode: Deku.Vnode
): Deku.RemoveNodeAction {
    return {
        type: 'REMOVE_NODE',
        payload: vnode
    };
}

export function updateThunk(
    prevVnode: Deku.ThunkVnode,
    nextVnode: Deku.ThunkVnode,
    path: string
): Deku.UpdateThunkAction {
    return {
        type: 'UPDATE_THUNK',
        payload: { prevVnode, nextVnode, path }
    };
}
