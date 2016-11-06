function isSupportedTypes(type: string): boolean {
    switch (type) {
        case 'text':
        case 'search':
        case 'tel':
        case 'url':
        case 'password': {
            return true;
        }
        default: {
            return false;
        }
    }
}

export function setify(element: HTMLElement, value: string): void {
    if (element instanceof HTMLInputElement) {
        if (isSupportedTypes(element.type)) {
            const start = element.selectionStart;
            const end = element.selectionEnd;

            element.value = value;
            element.setSelectionRange(start, end);
        } else {
            element.value = value;
        }
    }
}
