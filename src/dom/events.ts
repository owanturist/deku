/**
 * Special attributes that map to DOM events.
 */

export function getEventsByName(name: string): string | void {
    switch (name) {
        case 'onAbort': return 'abort';
        case 'onAnimationStart': return 'animationstart';
        case 'onAnimationIteration': return 'animationiteration';
        case 'onAnimationEnd': return 'animationend';
        case 'onBlur': return 'blur';
        case 'onCanPlay': return 'canplay';
        case 'onCanPlayThrough': return 'canplaythrough';
        case 'onChange': return 'change';
        case 'onClick': return 'click';
        case 'onContextMenu': return 'contextmenu';
        case 'onCopy': return 'copy';
        case 'onCut': return 'cut';
        case 'onDoubleClick': return 'dblclick';
        case 'onDrag': return 'drag';
        case 'onDragEnd': return 'dragend';
        case 'onDragEnter': return 'dragenter';
        case 'onDragExit': return 'dragexit';
        case 'onDragLeave': return 'dragleave';
        case 'onDragOver': return 'dragover';
        case 'onDragStart': return 'dragstart';
        case 'onDrop': return 'drop';
        case 'onDurationChange': return 'durationchange';
        case 'onEmptied': return 'emptied';
        case 'onEncrypted': return 'encrypted';
        case 'onEnded': return 'ended';
        case 'onError': return 'error';
        case 'onFocus': return 'focus';
        case 'onInput': return 'input';
        case 'onInvalid': return 'invalid';
        case 'onKeyDown': return 'keydown';
        case 'onKeyPress': return 'keypress';
        case 'onKeyUp': return 'keyup';
        case 'onLoad': return 'load';
        case 'onLoadedData': return 'loadeddata';
        case 'onLoadedMetadata': return 'loadedmetadata';
        case 'onLoadStart': return 'loadstart';
        case 'onPause': return 'pause';
        case 'onPlay': return 'play';
        case 'onPlaying': return 'playing';
        case 'onProgress': return 'progress';
        case 'onMouseDown': return 'mousedown';
        case 'onMouseEnter': return 'mouseenter';
        case 'onMouseLeave': return 'mouseleave';
        case 'onMouseMove': return 'mousemove';
        case 'onMouseOut': return 'mouseout';
        case 'onMouseOver': return 'mouseover';
        case 'onMouseUp': return 'mouseup';
        case 'onPaste': return 'paste';
        case 'onRateChange': return 'ratechange';
        case 'onReset': return 'reset';
        case 'onScroll': return 'scroll';
        case 'onSeeked': return 'seeked';
        case 'onSeeking': return 'seeking';
        case 'onSubmit': return 'submit';
        case 'onStalled': return 'stalled';
        case 'onSuspend': return 'suspend';
        case 'onTimeUpdate': return 'timeupdate';
        case 'onTransitionEnd': return 'transitionend';
        case 'onTouchCancel': return 'touchcancel';
        case 'onTouchEnd': return 'touchend';
        case 'onTouchMove': return 'touchmove';
        case 'onTouchStart': return 'touchstart';
        case 'onVolumeChange': return 'volumechange';
        case 'onWaiting': return 'waiting';
        case 'onWheel': return 'wheel';
        default: return undefined;
    }
}
