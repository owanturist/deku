export function createDOMElement(tagName: string): Element {
    switch (tagName) {
        case 'a':
        case 'circle':
        case 'clipPath':
        case 'componentTransferFunction':
        case 'defs':
        case 'desc':
        case 'ellipse':
        case 'feBlend':
        case 'feColorMatrix':
        case 'feComponentTransfer':
        case 'feComposite':
        case 'feConvolveMatrix':
        case 'feDiffuseLighting':
        case 'feDisplacementMap':
        case 'feDistantLight':
        case 'feFlood':
        case 'feFuncA':
        case 'feFuncB':
        case 'feFuncG':
        case 'feFuncR':
        case 'feGaussianBlur':
        case 'feImage':
        case 'feMerge':
        case 'feMergeNode':
        case 'feMorphology':
        case 'feOffset':
        case 'fePointLight':
        case 'feSpecularLighting':
        case 'feSpotLight':
        case 'feTile':
        case 'feTurbulence':
        case 'filter':
        case 'foreignObject':
        case 'g':
        case 'image':
        case 'gradient':
        case 'line':
        case 'linearGradient':
        case 'marker':
        case 'mask':
        case 'path':
        case 'metadata':
        case 'pattern':
        case 'polygon':
        case 'polyline':
        case 'radialGradient':
        case 'rect':
        case 'svg':
        case 'script':
        case 'stop':
        case 'style':
        case 'switch':
        case 'symbol':
        case 'tspan':
        case 'textContent':
        case 'text':
        case 'textPath':
        case 'textPositioning':
        case 'title':
        case 'use':
        case 'view': {
            return document.createElementNS('http://www.w3.org/2000/svg', tagName);
        }

        default: {
            return document.createElement(tagName);
        }
    }
}
