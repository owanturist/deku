import {
    create as createDOM
} from '../dom/create';
import {
    update as updateDOM
} from '../dom/update';
import {
    diffVnodes
} from '../diff';
import {
    Vnode
} from '../vnode';

interface BeginnerProgrammConfig<Msg, Model> {
    model: Model;
    view: (model: Model) => Vnode;
    update: (msg: Msg, model: Model) => Model;
}

export const beginnerProgram = <Msg, Model>(
    config: BeginnerProgrammConfig<Msg, Model>,
    container: HTMLElement
    ): void => {

    let DOMNode: Node;
    let prevVnode: Vnode;
    let currentModel: Model = config.model;

    const tagger = (msg: Msg) => {
        currentModel = config.update(msg, currentModel);
        const nextVnode = config.view(currentModel);
        const changes = diffVnodes(prevVnode, nextVnode, 'root');

        for (const change of changes) {
            DOMNode = updateDOM(DOMNode, tagger, change);
        }

        prevVnode = nextVnode;
    };

    prevVnode = config.view(config.model);
    DOMNode = createDOM(prevVnode, tagger, 'root');

    container.appendChild(DOMNode);
};
