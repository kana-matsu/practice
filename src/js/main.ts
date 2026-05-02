// Carousel
const carousel = (root: HTMLElement) => {
    const slides = root.querySelectorAll<HTMLElement>('.js-carousel__slide');
    const stop = root.querySelector<HTMLButtonElement>('.js-carousel__stop');
    const play = root.querySelector<HTMLButtonElement>('.js-carousel__play');
    const previous = root.querySelector<HTMLButtonElement>('.js-carousel__previous');
    const next = root.querySelector<HTMLButtonElement>('.js-carousel__next');
    const pagination = root.querySelector<HTMLUListElement>('.js-carousel__pagination');
    const template = root.querySelector<HTMLTemplateElement>('.js-carousel__template');

    if (!pagination || !template) {
        return;
    }

    const generateDots = () => {
        const fragment = document.createDocumentFragment();

        slides.forEach((_, i) => {
            const clone = template.content.cloneNode(true) as DocumentFragment;
            const dot = clone.querySelector<HTMLButtonElement>('.js-carousel__dot');

            if (!dot) {
                return;
            }

            dot.textContent = `${i + 1}`;
            fragment.append(dot);
        });

        return fragment;
    }

    const init = () => {
        const dots = generateDots();

        template.replaceWith(dots);
    }

    init();
}

const roots = document.querySelectorAll<HTMLElement>('.js-carousel');

roots.forEach(root => {
    carousel(root);
});
