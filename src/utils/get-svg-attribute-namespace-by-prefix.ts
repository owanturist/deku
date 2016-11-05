export function getSvgAttributeNamespaceByPrefix(prefix: string): string | void {
    switch (prefix) {
        case 'ev': return 'http://www.w3.org/2001/xml-events';
        case 'xlink': return 'http://www.w3.org/1999/xlink';
        case 'xml': return 'http://www.w3.org/XML/1998/namespace';
        case 'xmlns': return 'http://www.w3.org/2000/xmlns/';
        default: return undefined;
    }
}
