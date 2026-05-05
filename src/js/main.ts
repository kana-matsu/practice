// Carousel
const carousel = (root: HTMLElement) => {
    const wrapper = root.querySelector<HTMLElement>('.js-carousel__wrapper');
    const slides = root.querySelectorAll<HTMLElement>('.js-carousel__slide');
    const button = root.querySelector<HTMLButtonElement>('.js-carousel__button');
    const buttonText = root.querySelector<HTMLSpanElement>('.js-carousel__button-text');
    const previous = root.querySelector<HTMLButtonElement>('.js-carousel__previous');
    const next = root.querySelector<HTMLButtonElement>('.js-carousel__next');
    const pagination = root.querySelector<HTMLUListElement>('.js-carousel__pagination');
    const template = root.querySelector<HTMLTemplateElement>('.js-carousel__template');

    if (!wrapper || !pagination || !template || !next || !previous || !button) {
        return;
    }

    let currentIndex = 0;
    let isAnimating = false;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let dots: HTMLButtonElement[] = [];
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const INTERVAL = 5000;
    const MIN_DISTANCE = 50;

    const goTo = (i: number) => {
        if (i === currentIndex || isAnimating) {
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

    const autoplaySlides = () => {
        button.classList.remove('is-paused')
        button.classList.add('is-playing');

        if (buttonText) {
            buttonText.textContent = 'Pause';
        }

        intervalId ??= setInterval(goNext, INTERVAL);
    }

    const stopSlides = () => {
        button.classList.remove('is-playing')
        button.classList.add('is-paused');

        if (buttonText) {
            buttonText.textContent = 'Play';
        }
    
        if (!intervalId) {
            return;
        }

        clearInterval(intervalId);
        intervalId = null;
    }

    const resetTimer = () => {
        if (!intervalId) {
            return;
        }

        clearInterval(intervalId);
        intervalId = setInterval(goNext, INTERVAL);
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
                resetTimer();
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

        autoplaySlides();

        wrapper.addEventListener('transitionstart', () => {
            isAnimating = true;
        });

        wrapper.addEventListener('transitionend', () => {
            isAnimating = false;
        });

        wrapper.addEventListener('touchstart', (e: TouchEvent) => {
            isAnimating = true;

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        wrapper.addEventListener('touchmove', (e: TouchEvent) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
        });

        wrapper.addEventListener('touchend', () => {
            isAnimating = false;

            const distanceX = endX - startX;
            const distanceY = endY - startY;

            if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > MIN_DISTANCE) {
                if (distanceX > 0) {
                    goPrevious();
                } else {
                    goNext();
                }
            }

            resetTimer();
        });

        next.addEventListener('click', () => {
            goNext();
            resetTimer();
        });

        previous.addEventListener('click', () => {
            goPrevious();
            resetTimer();
        });
        
        button.addEventListener('click', () => {
            if (!intervalId) {
                autoplaySlides();
            } else {
                stopSlides();
            }
        });
    }

    init();
}

const roots = document.querySelectorAll<HTMLElement>('.js-carousel');

roots.forEach(root => {
    carousel(root);
});
