export interface Msg {
    type: string;
}

export type Update<Model> = <M extends Msg>(msg: M, model: Model) => Model;
