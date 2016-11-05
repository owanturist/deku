export function isSvg(tagName: string): boolean {
    switch (tagName) {
        case 'animate':
        case 'circle':
        case 'clipPath':
        case 'defs':
        case 'ellipse':
        case 'g':
        case 'line':
        case 'linearGradient':
        case 'mask':
        case 'path':
        case 'pattern':
        case 'polygon':
        case 'polyline':
        case 'radialGradient':
        case 'rect':
        case 'stop':
        case 'svg':
        case 'text':
        case 'tspan':
        case 'use': {
            return true;
        }

        default: {
            return false;
        }
    }
}
