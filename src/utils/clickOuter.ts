export const clickOuter = (ref: HTMLDivElement, callback: () => void, button: HTMLButtonElement | null = null) => {
    const onClick = (e: MouseEvent) => {
        const target = e.target as HTMLDivElement;
        if(button) {
            if(!(ref.contains(target) || button.contains(target))) {
                callback();
            } 
        } else {
            ref.contains(target) || callback();
        }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
}
