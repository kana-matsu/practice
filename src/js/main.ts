// Carousel
const carousel = (root: HTMLElement) => {
    const wrapper = root.querySelector<HTMLElement>('.js-carousel__wrapper');
    const slides = root.querySelectorAll<HTMLElement>('.js-carousel__slide');
    const stop = root.querySelector<HTMLButtonElement>('.js-carousel__stop');
    const play = root.querySelector<HTMLButtonElement>('.js-carousel__play');
    const previous = root.querySelector<HTMLButtonElement>('.js-carousel__previous');
    const next = root.querySelector<HTMLButtonElement>('.js-carousel__next');
    const pagination = root.querySelector<HTMLUListElement>('.js-carousel__pagination');
    const template = root.querySelector<HTMLTemplateElement>('.js-carousel__template');

    if (!wrapper || !pagination || !template || !next || !previous || !stop || !play) {
        return;
    }

    let currentIndex = 0;

    const generateDots = () => {
        const fragment = document.createDocumentFragment();

        slides.forEach((_, i) => {
            const clone = template.content.cloneNode(true) as DocumentFragment;
            const dot = clone.querySelector<HTMLButtonElement>('.js-carousel__dot');

            if (!dot) {
                return;
            }

            dot.textContent = `${i + 1}`;
            fragment.append(clone);
        });

        return fragment;
    }

    const goTo = (i: number) => {
        wrapper.style.transform = `translate3d(-${i * 100}%, 0, 0)`;
        currentIndex = i;
    }

    const init = () => {
        const dots = generateDots();

        template.replaceWith(dots);

        next.addEventListener('click', () => {
            if (currentIndex === slides.length - 1) {
                goTo(0);
            } else {
                goTo(currentIndex + 1);
            }
        });

        previous.addEventListener('click', () => {
            if (currentIndex === 0) {
                goTo(slides.length - 1);
            } else {
                goTo(currentIndex - 1);
            }
        });
    }

    init();
}

const roots = document.querySelectorAll<HTMLElement>('.js-carousel');

roots.forEach(root => {
    carousel(root);
});
