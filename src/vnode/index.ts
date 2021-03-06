// tslint:disable-next-line:no-empty-interface
export interface Props {}

// tslint:disable-next-line:no-empty-interface
export interface Attributes extends Props {}

export type Vnode
    = Native
    | Text
    | Tagger
    ;

export interface Native {
    readonly type: 'NATIVE';
    readonly tagName: string;
    readonly attributes: Attributes;
    readonly children: Vnode[];
}

export const Native = (
    tagName: string,
    attributes: Attributes,
    children: Vnode[]
    ): Native => ({
    type: 'NATIVE',
    tagName,
    attributes,
    children
});

export const isSameNative = (
    leftVnode: Native,
    rightVnode: Native
    ): boolean => leftVnode.tagName === rightVnode.tagName;

export interface Text {
    readonly type: 'TEXT';
    readonly text: string;
}

export const Text = (text: string): Text => ({
    type: 'TEXT',
    text
});

export const isSameText = (leftVnode: Text, rightVnode: Text): boolean => leftVnode.text === rightVnode.text;

export interface Tagger {
    readonly type: 'TAGGER';
    readonly tagger: any;
    readonly vnode: Vnode;
}

export const Tagger = (tagger: any, vnode: Vnode): Tagger => ({
    type: 'TAGGER',
    tagger,
    vnode
});

export const concatPaths = (path: string, position: number): string => `${path}.${position}`;

export interface KeyPatching {
    vnode: Vnode;
    key: number;
}

export const KeyPatching = (vnode: Vnode, key: number): KeyPatching => ({
    vnode,
    key
});

export const getKey = (keyPatching: KeyPatching): number => keyPatching.key;

export const buildKeyPatchings = (vnodes: Vnode[]): KeyPatching[] => {
    const { length } = vnodes;

    if (length === 0) {
        return [];
    }

    const result: KeyPatching[] = [];

    for (let index = 0; index < length; index++) {
        result[ index ] = KeyPatching(vnodes[ index ], index);
    }

    return result;
};
