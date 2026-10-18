import { Component } from '../base/Component';

interface GalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}