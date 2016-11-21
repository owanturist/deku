export default Deku;
export as namespace Deku;

declare namespace Deku {

    type Key = string | number;

    interface Attributes extends Props {
        key?: Key;
    }

    interface Props {}

    type _Child
        = Vnode
        | string
        | number
        | boolean
        | void

    type Child
        = _Child
        | _Child[]

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
        state?: {
            vnode: Vnode;
            model: any;
        }
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

    interface SetAttributeAction {
        type: 'SET_ATTRIBUTE';
        payload: {
            attribute: string;
            prevValue: any;
            nextValue: any;
        };
    }

    interface RemoveAttributeAction {
        type: 'REMOVE_ATTRIBUTE';
        payload: {
            attribute: string;
            value: any;
        }
    }

    interface InsertChildAction {
        type: 'INSERT_CHILD';
        payload: {
            vnode: Vnode;
            position: number;
            path: string;
        }
    }

    interface RemoveChildAction {
        type: 'REMOVE_CHILD';
        payload: number;
    }

    interface UpdateChildAction {
        type: 'UPDATE_CHILD';
        payload: {
            index: number;
            changes: DiffAction[]
        }
    }

    interface UpdateChildrenAction {
        type: 'UPDATE_CHILDREN';
        payload: DiffAction[]
    }

    interface InsertBeforeAction {
        type: 'INSERT_BEFORE';
        payload: number;
    }

    interface ReplaceNodeAction {
        type: 'REPLACE_NODE';
        payload: {
            prevVnode: Vnode;
            nextVnode: Vnode;
            path: string;
        }
    }

    interface RemoveNodeAction {
        type: 'REMOVE_NODE';
        payload: Vnode;
    }

    interface UpdateThunkAction {
        type: 'UPDATE_THUNK';
        payload: {
            prevVnode: ThunkVnode;
            nextVnode: ThunkVnode;
            path: string;
        };
    }
}
