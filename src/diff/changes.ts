import {
    Vnode
} from '../vnode';

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
    ;

export interface SetAttribute {
    type: 'SET_ATTRIBUTE';
    attribute: string;
    nextValue: any;
    prevValue: any;
}

export const SetAttribute = (
    attribute: string,
    nextValue: any,
    prevValue: any
    ): SetAttribute => ({
    type: 'SET_ATTRIBUTE',
    attribute,
    nextValue,
    prevValue
});

export interface RemoveAttribute {
    type: 'REMOVE_ATTRIBUTE';
    attribute: string;
    value: any;
}

export const RemoveAttribute = (
    attribute: string,
    value: any
    ): RemoveAttribute => ({
    type: 'REMOVE_ATTRIBUTE',
    attribute,
    value
});

export interface InsertChild {
    type: 'INSERT_CHILD';
    vnode: Vnode;
    position: number;
    path: string;
}

export const InsertChild = (
    vnode: Vnode,
    position: number,
    path: string
    ): InsertChild => ({
    type: 'INSERT_CHILD',
    vnode,
    position,
    path
});

export interface RemoveChild {
    type: 'REMOVE_CHILD';
    position: number;
}

export const RemoveChild = (
    position: number
    ): RemoveChild => ({
    type: 'REMOVE_CHILD',
    position
});

export interface UpdateChild {
    type: 'UPDATE_CHILD';
    position: number;
    changes: Change[];
}

export const UpdateChild = (
    position: number,
    changes: Change[]
    ): UpdateChild => ({
    type: 'UPDATE_CHILD',
    position,
    changes
});

export interface UpdateChildren {
    type: 'UPDATE_CHILDREN';
    changes: Change[];
}

export const UpdateChildren = (
    changes: Change[]
    ): UpdateChildren => ({
    type: 'UPDATE_CHILDREN',
    changes
});

export interface InsertBefore {
    type: 'INSERT_BEFORE';
    position: number;
}

export const InsertBefore = (
    position: number
    ): InsertBefore => ({
    type: 'INSERT_BEFORE',
    position
});

export interface ReplaceNode {
    type: 'REPLACE_NODE';
    prevVnode: Vnode;
    nextVnode: Vnode;
    path: string;
}

export const ReplaceNode = (
    prevVnode: Vnode,
    nextVnode: Vnode,
    path: string
    ): ReplaceNode => ({
    type: 'REPLACE_NODE',
    prevVnode,
    nextVnode,
    path
});

export interface RemoveNode {
    type: 'REMOVE_NODE';
    vnode: Vnode;
}

export const RemoveNode = (
    vnode: Vnode
    ): RemoveNode => ({
    type: 'REMOVE_NODE',
    vnode
});
