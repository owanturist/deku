import {
    Vnode,
    Component as ComponentVnode,
    Thunk as ThunkVnode
} from 'vnode';

export type Change<P, C>
    = SetAttribute
    | RemoveAttribute
    | InsertChild<P, C>
    | RemoveChild
    | UpdateChild<P, C>
    | UpdateChildren<P, C>
    | InsertBefore
    | ReplaceNode<P, C>
    | RemoveNode<P, C>
    | UpdateThunk<P, C>
    | UpdateComponent<P, C>

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
export type InsertChild<P, C> = {
    type: INSERT_CHILD,
    payload: {
        vnode: Vnode<P, C>,
        position: number,
        path: string
    }
};

export function insertChild<P, C>(
    vnode: Vnode<P, C>,
    position: number,
    path: string
    ): InsertChild<P, C> {
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
export type UpdateChild<P, C> = {
    type: UPDATE_CHILD,
    payload: {
        position: number,
        changes: Change<P, C>[]
    }
};

export function updateChild<P, C>(
    position: number,
    changes: Change<P, C>[]
    ): UpdateChild<P, C> {
    return {
        type: UPDATE_CHILD,
        payload: { position, changes }
    };
}


export type UPDATE_CHILDREN = 'CHANGE/UPDATE_CHILDREN';
export const UPDATE_CHILDREN: UPDATE_CHILDREN = 'CHANGE/UPDATE_CHILDREN';
export type UpdateChildren<P, C> = {
    type: UPDATE_CHILDREN,
    payload: Change<P, C>[]
};

export function updateChildren<P, C>(
    changes: Change<P, C>[]
    ): UpdateChildren<P, C> {
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
export type ReplaceNode<P, C> = {
    type: REPLACE_NODE,
    payload: {
        prevVnode: Vnode<P, C>,
        nextVnode: Vnode<P, C>,
        path: string
    }
};

export function replaceNode<P, C>(
    prevVnode: Vnode<P, C>,
    nextVnode: Vnode<P, C>,
    path: string
    ): ReplaceNode<P, C> {
    return {
        type: REPLACE_NODE,
        payload: { prevVnode, nextVnode, path }
    };
}


export type REMOVE_NODE = 'CHANGE/REMOVE_NODE';
export const REMOVE_NODE: REMOVE_NODE = 'CHANGE/REMOVE_NODE';
export type RemoveNode<P, C> = {
    type: REMOVE_NODE,
    payload: Vnode<P, C>
};

export function removeNode<P, C>(
    vnode: Vnode<P, C>
    ): RemoveNode<P, C> {
    return {
        type: REMOVE_NODE,
        payload: vnode
    };
}


export type UPDATE_THUNK = 'CHANGE/UPDATE_THUNK';
export const UPDATE_THUNK: UPDATE_THUNK = 'CHANGE/UPDATE_THUNK';
export type UpdateThunk<P, C> = {
    type: UPDATE_THUNK,
    payload: {
        prevThunk: ThunkVnode<P, C>,
        nextThunk: ThunkVnode<P, C>,
        path: string
    }
};

export function updateThunk<P, C>(
    prevThunk: ThunkVnode<P, C>,
    nextThunk: ThunkVnode<P, C>,
    path: string
    ): UpdateThunk<P, C> {
    return {
        type: UPDATE_THUNK,
        payload: { prevThunk, nextThunk, path }
    };
}


export type UPDATE_COMPONENT = 'CHANGE/UPDATE_COMPONENT';
export const UPDATE_COMPONENT: UPDATE_COMPONENT = 'CHANGE/UPDATE_COMPONENT';
export type UpdateComponent<P, C> = {
    type: UPDATE_COMPONENT,
    payload: {
        prevThunk: ComponentVnode<P, C>,
        nextThunk: ComponentVnode<P, C>,
        path: string
    }
};

export function updateComponent<P, C>(
    prevThunk: ComponentVnode<P, C>,
    nextThunk: ComponentVnode<P, C>,
    path: string
    ): UpdateComponent<P, C> {
    return {
        type: UPDATE_COMPONENT,
        payload: { prevThunk, nextThunk, path }
    };
}
