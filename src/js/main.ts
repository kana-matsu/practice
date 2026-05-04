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
    let dots: HTMLButtonElement[] = [];

    const goTo = (i: number) => {
        if (i === currentIndex) {
            return;
        }

        wrapper.style.transform = `translate3d(-${i * 100}%, 0, 0)`;
        
        slides[currentIndex].setAttribute('inert', '');
        slides[i].removeAttribute('inert');

        dots[currentIndex].removeAttribute('aria-current');
        dots[i].setAttribute('aria-current', 'true');

        currentIndex = i;
    }

    const goNext = () => {
        if (currentIndex === slides.length - 1) {
            goTo(0);
        } else {
            goTo(currentIndex + 1);
        }
    }

    const goPrevious = () => {
        if (currentIndex === 0) {
            goTo(slides.length - 1);
        } else {
            goTo(currentIndex - 1);
        }
    }

    const autoplay = () => {
        setInterval(goNext, 5000);
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

            if (i === currentIndex) {
                dot.setAttribute('aria-current', 'true');
            }
            
            dot.addEventListener('click', () => {
                goTo(i);
            });

            dots.push(dot);
            fragment.append(clone);
        });

        return fragment;
    }

    const init = () => {
        const fragment = generateDots();

        template.replaceWith(fragment);

        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                return;
            }

            slide.setAttribute('inert', '');
        });

        autoplay();

        next.addEventListener('click', goNext);
        previous.addEventListener('click', goPrevious);
    }

    init();
}

const roots = document.querySelectorAll<HTMLElement>('.js-carousel');

roots.forEach(root => {
    carousel(root);
});
