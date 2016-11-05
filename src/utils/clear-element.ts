export function clearElement(element: HTMLElement): void {
    let node;

    while (node = element.firstChild) {
        element.removeChild(node);
    }
}
