import {
    Vnode,
    Thunk
} from 'vnode';

export type Change
    = SetAttribute
    | RemoveAttribute
    | InsertChild
    | RemoveChild
    | UpdateChild
    | UpdateChildren
    | InsertBefore
    | ReplaceNode
    | RemoveNode
    | UpdateThunk

export type SET_ATTRIBUTE = 'CHANGE/SET_ATTRIBUTE';
export const SET_ATTRIBUTE: SET_ATTRIBUTE = 'CHANGE/SET_ATTRIBUTE';
export type SetAttribute = {
    type: SET_ATTRIBUTE,
    payload: {
        attribute: string,
        nextValue: any,
        prevValue: any
    }
};

export function setAttribute(
    attribute: string,
    nextValue: any,
    prevValue: any
    ): SetAttribute {
    return {
        type: SET_ATTRIBUTE,
        payload: { attribute, nextValue, prevValue }
    };
}


export type REMOVE_ATTRIBUTE = 'CHANGE/REMOVE_ATTRIBUTE';
export const REMOVE_ATTRIBUTE: REMOVE_ATTRIBUTE = 'CHANGE/REMOVE_ATTRIBUTE';
export type RemoveAttribute = {
    type: REMOVE_ATTRIBUTE,
    payload: {
        attribute: string,
        value: any
    }
};

export function removeAttribute(
    attribute: string,
    value: any
    ): RemoveAttribute {
    return {
        type: REMOVE_ATTRIBUTE,
        payload: { attribute, value }
    };
}


export type INSERT_CHILD = 'CHANGE/INSERT_CHILD';
export const INSERT_CHILD: INSERT_CHILD = 'CHANGE/INSERT_CHILD';
export type InsertChild = {
    type: INSERT_CHILD,
    payload: {
        vnode: Vnode,
        position: number,
        path: string
    }
};

export function insertChild(
    vnode: Vnode,
    position: number,
    path: string
    ): InsertChild {
    return {
        type: INSERT_CHILD,
        payload: { vnode, position, path }
    };
}


export type REMOVE_CHILD = 'CHANGE/REMOVE_CHILD';
export const REMOVE_CHILD: REMOVE_CHILD = 'CHANGE/REMOVE_CHILD';
export type RemoveChild = {
    type: REMOVE_CHILD,
    payload: number
};

export function removeChild(
    position: number
    ): RemoveChild {
    return {
        type: REMOVE_CHILD,
        payload: position
    };
}


export type UPDATE_CHILD = 'CHANGE/UPDATE_CHILD';
export const UPDATE_CHILD: UPDATE_CHILD = 'CHANGE/UPDATE_CHILD';
export type UpdateChild = {
    type: UPDATE_CHILD,
    payload: {
        position: number,
        changes: Change[]
    }
};

export function updateChild(
    position: number,
    changes: Change[]
    ): UpdateChild {
    return {
        type: UPDATE_CHILD,
        payload: { position, changes }
    };
}


export type UPDATE_CHILDREN = 'CHANGE/UPDATE_CHILDREN';
export const UPDATE_CHILDREN: UPDATE_CHILDREN = 'CHANGE/UPDATE_CHILDREN';
export type UpdateChildren = {
    type: UPDATE_CHILDREN,
    payload: Change[]
};

export function updateChildren(
    changes: Change[]
    ): UpdateChildren {
    return {
        type: UPDATE_CHILDREN,
        payload: changes
    };
}


export type INSERT_BEFORE = 'CHANGE/INSERT_BEFORE';
export const INSERT_BEFORE: INSERT_BEFORE = 'CHANGE/INSERT_BEFORE';
export type InsertBefore = {
    type: INSERT_BEFORE,
    payload: number
};

export function insertBefore(
    position: number
    ): InsertBefore {
    return {
        type: INSERT_BEFORE,
        payload: position
    };
}


export type REPLACE_NODE = 'CHANGE/REPLACE_NODE';
export const REPLACE_NODE: REPLACE_NODE = 'CHANGE/REPLACE_NODE';
export type ReplaceNode = {
    type: REPLACE_NODE,
    payload: {
        prevVnode: Vnode,
        nextVnode: Vnode,
        path: string
    }
};

export function replaceNode(
    prevVnode: Vnode,
    nextVnode: Vnode,
    path: string
    ): ReplaceNode {
    return {
        type: REPLACE_NODE,
        payload: { prevVnode, nextVnode, path }
    };
}


export type REMOVE_NODE = 'CHANGE/REMOVE_NODE';
export const REMOVE_NODE: REMOVE_NODE = 'CHANGE/REMOVE_NODE';
export type RemoveNode = {
    type: REMOVE_NODE,
    payload: Vnode
};

export function removeNode(
    vnode: Vnode
    ): RemoveNode {
    return {
        type: REMOVE_NODE,
        payload: vnode
    };
}


export type UPDATE_THUNK = 'CHANGE/UPDATE_THUNK';
export const UPDATE_THUNK: UPDATE_THUNK = 'CHANGE/UPDATE_THUNK';
export type UpdateThunk = {
    type: UPDATE_THUNK,
    payload: {
        prevThunk: Vnode,
        nextThunk: Vnode,
        path: string
    }
};

export function updateThunk(
    prevThunk: Thunk,
    nextThunk: Thunk,
    path: string
    ): UpdateThunk {
    return {
        type: UPDATE_THUNK,
        payload: { prevThunk, nextThunk, path }
    };
}
