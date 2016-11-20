export default Deku;
export as namespace Deku;

declare namespace Deku {

    type Key = string | number;

    interface Attributes extends Props {
        key?: Key;
    }

    interface Props { }

    type Child
        = Vnode
        | string
        | number
        | boolean
        | void

    interface KeyPatching {
        key: Key;
        vnode: Vnode;
        index: number;
    }

    type Vnode
        = NativeVnode
        | ThunkVnode
        | TextVnode
        | EmptyVnode

    interface NativeVnode {
        type: 'native';
        tagName: string;
        attributes: Props;
        children: Vnode[];
        key?: Key;
    }

    interface ThunkVnode {
        type: 'thunk';
        render: any;
        props: Props;
        children: Vnode[];
        key?: Key;
    }

    interface TextVnode {
        type: 'text';
        text: string;
    }

    interface EmptyVnode {
        type: 'empty';
    }

    type DiffAction
        = SetAttributeAction
        | RemoveAttributeAction
        | InsertChildAction
        | RemoveChildAction
        | UpdateChildAction
        | UpdateChildrenAction
        | InsertBeforeAction
        | ReplaceNodeAction
        | RemoveNodeAction
        | UpdateThunkAction

    type SetAttributeAction = {
        type: 'SET_ATTRIBUTE';
        payload: {
            attribute: string;
            prevValue: any;
            nextValue: any;
        };
    }

    type RemoveAttributeAction = {
        type: 'REMOVE_ATTRIBUTE';
        payload: {
            attribute: string;
            value: any;
        }
    }

    type InsertChildAction = {
        type: 'INSERT_CHILD';
        payload: {
            vnode: Vnode;
            position: number;
            path: string;
        }
    }

    type RemoveChildAction = {
        type: 'REMOVE_CHILD';
        payload: number;
    }

    type UpdateChildAction = {
        type: 'UPDATE_CHILD';
        payload: {
            index: number;
            changes: DiffAction[]
        }
    }

    type UpdateChildrenAction = {
        type: 'UPDATE_CHILDREN';
        payload: DiffAction[]
    }

    type InsertBeforeAction = {
        type: 'INSERT_BEFORE';
        payload: number;
    }

    type ReplaceNodeAction = {
        type: 'REPLACE_NODE';
        payload: {
            prevVnode: Vnode;
            nextVnode: Vnode;
            path: string;
        }
    }

    type RemoveNodeAction = {
        type: 'REMOVE_NODE';
        payload: {
            vnode: Vnode;
        };
    }

    type UpdateThunkAction = {
        type: 'UPDATE_THUNK';
        payload: {
            prevVnode: ThunkVnode;
            nextVnode: ThunkVnode;
            path: string;
        };
    }
}
