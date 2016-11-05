import {
    getSvgAttributeNamespaceByName
} from 'utils/get-svg-attribute-namespace-by-name';
import { isString } from 'utils/is-string';

export function setAttribute(node: HTMLElement, name: string, value: string): void {
    const svgAttributeNamespace = getSvgAttributeNamespaceByName(name);

    if (isString(svgAttributeNamespace)) {
        node.setAttributeNS(svgAttributeNamespace, name, value);
    } else {
        node.setAttribute(name, value);
    }
}
