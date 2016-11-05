import {
    getSvgAttributeNamespaceByPrefix
} from 'utils/get-svg-attribute-namespace-by-prefix';
import { isString } from 'utils/is-string';

export function getSvgAttributeNamespaceByName(attributeName: string): string | void {
    if (attributeName.indexOf(':') === -1) {
        return undefined;
    }

    const prefix = attributeName.split(':', 1)[ 0 ];
    const svgAttributeNamespace = getSvgAttributeNamespaceByPrefix(prefix);

    if (isString(svgAttributeNamespace)) {
        return svgAttributeNamespace;
    }

    throw new Error(`Prefix "${prefix}" is not supported by SVG.`);
}
