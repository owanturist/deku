export function isValidAttributeValue(value: any): boolean {
    switch (typeof value) {
        case 'string':
        case 'number': {
            return true;
        }
        case 'boolean': {
            return value;
        }
        default: {
            return false;
        }
    }
}
