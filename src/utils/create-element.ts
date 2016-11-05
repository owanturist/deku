import { isSvg } from 'utils/is-svg';
import { svgNamespace } from 'utils/svg-namespace';

export function createElement(tagName: string): Element {
    return isSvg(tagName) ?
        document.createElementNS(svgNamespace, tagName) :
        document.createElement(tagName);
}
