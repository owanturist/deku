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
        | null

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
        = {
            type: 'SET_ATTRIBUTE';
            payload: {
                attribute: string;
                prevValue: any;
                nextValue: any;
            };
        }
        | {
            type: 'REMOVE_ATTRIBUTE';
            payload: {
                attribute: string;
                value: any;
            }
        }
        | {
            type: 'INSERT_CHILD';
            payload: {
                vnode: Vnode;
                position: number;
                path: string;
            }
        }
        | {
            type: 'REMOVE_CHILD';
            payload: number;
        }
        | {
            type: 'UPDATE_CHILD';
            payload: {
                index: number;
                changes: DiffAction[]
            }
        }
        | {
            type: 'UPDATE_CHILDREN';
            payload: DiffAction[]
        }
        | {
            type: 'INSERT_BEFORE';
            payload: number;
        }
        | {
            type: 'REPLACE_NODE';
            payload: {
                prevVnode: Vnode | void;
                nextVnode: Vnode | void;
                path: string;
            }
        }
        | {
            type: 'REMOVE_NODE';
            payload: {
                vnode: Vnode | void;
            };
        }
        | {
            type: 'UPDATE_THUNK';
            payload: {
                prevVnode: ThunkVnode;
                nextVnode: ThunkVnode;
                path: string;
            };
        }
        | {
            type: 'SAME_NODE';
        }
}
