type Action
    = NoOp
    | SetAttribute
    | RemoveAttribute


interface NoOp {
    type: 'NOOP';
}

export function noop(): NoOp {
    return {
        type: 'NOOP'
    };
}


interface SetAttribute {
    type: 'SET_ATTRIBUTE';
}

export function setAttribute(): SetAttribute {
    return {
        type: 'SET_ATTRIBUTE'
    };
}


interface RemoveAttribute {
    type: 'REMOVE_ATTRIBUTE';
}

export function RemoveAttribute(): RemoveAttribute {
    return {
        type: 'REMOVE_ATTRIBUTE'
    };
}

