export default Deku;
export as namespace Deku;

declare namespace Deku {

    type Key = string | number;

    interface Attributes extends Props {
        key?: Key;
    }

    interface Props {}

    type Child
        = Vnode
        | string
        | number
        | null

    type Vnode
        = NativeVnode
        | ThunkVnode
        | TextVnode
        | EmptyVnode

    interface NativeVnode {
        type: 'native';
        tagName: string;
        props: Props;
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
}
