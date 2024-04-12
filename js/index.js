'use strict';

let root = document.querySelector(':root');
let menu = document.querySelector('.menu');
let servicesLinks = document.querySelector('.services-links');
let navBtn = document.querySelector('.nav-btn');
let subMenuContainer = document.querySelector('.sub-menu-container');
let mainNavList = document.querySelector('.main-nav-list');
let desktop = matchMedia('(min-width: 64em)');
let navLinks = document.querySelectorAll('.nav-link');
let navSubLinks = document.querySelectorAll('.nav-sub-link');
let navBtnKeysDown = document.querySelectorAll('.nav-btn-keysdown');
/**@type {HTMLElement} */
let slidesContainer = document.querySelector('.slides-container');
// let indicatorsContainer = document.querySelector('.indicators-container');
let indicators = document.querySelectorAll('.indicator');
let slider = document.querySelector('.slider');
let slides = document.querySelectorAll('.slide');
let internalLinks = document.querySelectorAll('.internal-link');
let linkedElements = document.querySelectorAll('.linked-element');
let topButton = document.querySelector('.top-button');
let intervald = 15000;
let timeout;
let timeout2;
const MAX = slides.length + 1;
let indexIndicator = 0;
let indexSlide = 0;
let isMovingAtBegin = false;
let isMovingAtEnd = false;

slidesContainer.style.setProperty('--width', `${ (MAX * 100) }%`);
slidesContainer.appendChild(slides[0].cloneNode(true));
// indicatorsContainer.appendChild(indicators[0].cloneNode(true));
// indicatorsContainer.lastChild.classList.add('hiddened');

servicesLinks.classList.add('services-links-closed');
subMenuContainer.classList.add('sub-menu-container-reduced');
indicators[indexIndicator].classList.add('indicator-actived');

function activeIndicator() {
    if( indexIndicator === MAX - 1) {
        indexIndicator = 0;
    }

    if(indexIndicator > 0 && indexIndicator < MAX) {
        indicators[indexIndicator - 1].classList.remove('indicator-actived');
    }

    if(indexIndicator >= 0 && indexIndicator < MAX) {
        indicators[indexIndicator].classList.add('indicator-actived');
    }
}

function defaultMovement() {
    slidesContainer.style.transitionDuration = '200ms';
    slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
}

function movingRight() {

    if( isMovingAtEnd ) {
        indexSlide = MAX - 1;
        slidesContainer.style.transitionDuration = '0ms';
        slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
        isMovingAtEnd = false;

        setTimeout(() => {
            deactiveIndicator();
            slidesContainer.style.transitionDuration = '200ms';
            slidesContainer.style.transform = `translateX(${ -(--indexSlide) * ( 100 / MAX ) }%)`;
            indexIndicator = indexSlide;
            activeIndicator();
        }, 60);
    } else  {
        defaultMovement();
    }
}

function movingLeft() {

    if( isMovingAtBegin ) {
        indexSlide = 0;
        slidesContainer.style.transitionDuration = '0ms';
        slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
        isMovingAtBegin = false;

        setTimeout(() => {
            deactiveIndicator();
            slidesContainer.style.transitionDuration = '200ms';
            slidesContainer.style.transform = `translateX(${ -(++indexSlide) * ( 100 / MAX ) }%)`;
            indexIndicator = indexSlide;
            activeIndicator();
        }, 60);
    } else  {
        defaultMovement();
    }

}

function deactiveIndicator() {
    for(let element of indicators) {
        if(element.classList.contains('indicator-actived')) {
            element.classList.remove('indicator-actived');
        }
    }
}

function moveLeft() {
    movingLeft();
    activeIndicator();
};


function moveRight() {
    movingRight();
    activeIndicator();
};

let loop = function incrementIndex() {
    swipeLeft();
    timeout = setTimeout(incrementIndex, 15000);
}

function makeFocusable(element) {
    element.tabIndex = 0;
}

function makeUnfocusable(element) {
    element.tabIndex = -1;
}

function makeNonNavSubLinkFocusable() {
    navLinks.forEach((element) => {
        if(!element.classList.contains('nav-sub-link')) {
         makeFocusable(element);
        } else {
         makeUnfocusable(element);
        }
     });
}


function showOrHideMenu() {

    subMenuContainer.classList.replace('sub-menu-container-expanded', 'sub-menu-container-reduced');
    servicesLinks.classList.remove('services-links-opened');
    servicesLinks.classList.add('closed');
    navBtn.classList.remove('nav-btn-clicked');
    menu.classList.remove('opened-menu');
    mainNavList.classList.add('main-nav-list-closed');
    mainNavList.classList.remove('main-nav-list-opened');
    mainNavList.classList.add('closed');
    navLinks.forEach((element) => {
        makeUnfocusable(element);
    });

    if(desktop.matches) {
        mainNavList.classList.remove('main-nav-list-closed');
        mainNavList.classList.remove('closed');
        makeNonNavSubLinkFocusable();
    }
}

navBtn.addEventListener('click', () => {
    servicesLinks.classList.toggle('services-links-opened');
    navBtn.classList.toggle('nav-btn-clicked');
    if(!servicesLinks.classList.contains('services-links-opened')) {
        navSubLinks.forEach((element) => {
            makeUnfocusable(element);
        });
        setTimeout(
            () => {
                subMenuContainer.classList.replace('sub-menu-container-expanded', 'sub-menu-container-reduced');
                servicesLinks.classList.add('closed');
            }, 500
        );
    } else {
        navSubLinks.forEach((element) => {
            makeFocusable(element);
        });
        servicesLinks.classList.remove('closed');
        subMenuContainer.classList.replace('sub-menu-container-reduced', 'sub-menu-container-expanded');
    }
});

menu.addEventListener('click', () => {
    menu.classList.toggle('opened-menu');
    mainNavList.classList.toggle('main-nav-list-opened');
    if(!menu.classList.contains('opened-menu')) {
        setTimeout(
            () => {
                servicesLinks.classList.remove('services-links-opened');
                servicesLinks.classList.add('closed');
                mainNavList.classList.add('closed');
                navBtn.classList.remove('nav-btn-clicked');
            }, 500
        );
    } else {
        mainNavList.classList.remove('closed');
        makeNonNavSubLinkFocusable();
    }
});

navLinks.forEach( (element) => {
    element.addEventListener('click', () => {
        if(mainNavList.classList.contains('main-nav-list-closed')) {
            mainNavList.classList.add('closed');
            menu.classList.remove('opened-menu');
            mainNavList.classList.remove('main-nav-list-opened');
            navLinks.forEach((element) => {
                makeUnfocusable(element);
            });
        }

        servicesLinks.classList.remove('services-links-opened');
        servicesLinks.classList.add('closed');
        navBtn.classList.remove('nav-btn-clicked');
        subMenuContainer.classList.replace('sub-menu-container-expanded', 'sub-menu-container-reduced');
        navSubLinks.forEach((element) => {
            makeUnfocusable(element);
        });
    });
} );

navBtnKeysDown.forEach( (element) => {
    element.addEventListener('keydown', (event) => {
        // ASCII-Code CR(carriage return or Enter) = 13(Decimal)
        if(event.keyCode === 13) {
            element.classList.add('nav-link-btn-clicked');
        }
        setTimeout(() => {
            element.classList.remove('nav-link-btn-clicked');
        }, 200);
    });
});

for(let i = 0; i < indicators.length; ++i) {
    indicators[i].addEventListener('click', () => {
        clearTimeout(timeout);
        if(timeout2) {
            clearTimeout(timeout2);
        }

        deactiveIndicator();

        if( ( indexSlide === 0 || indexSlide === MAX - 1) && i === MAX - 2 ) {
            moveToLastSlide();
            indexIndicator = indexSlide = i;
            setTimeout(moveLeft, 60);
        } else if(indexSlide === MAX - 2 && i === 0) {
            setAtFirstSlide();
        } else if(indexSlide === MAX - 1) {
            moveToFirstSlide();
            indexIndicator = indexSlide = i;
            setTimeout(moveLeft, 60);
        } else {
            indexIndicator = indexSlide = i;
            moveLeft();
        }

        timeout2 = setTimeout(loop, 15000);
    });
}

for(let i = 0; i < internalLinks.length; ++i) {
    internalLinks[i].addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollBy({
            behavior: 'instant',
            top: linkedElements[i].getBoundingClientRect().top - 160,
        });
    });
}

topButton.addEventListener('click', () => {
    window.scrollBy({
        behavior: 'instant',
        top: root.getBoundingClientRect().top - 160,
    });
});

topButton.addEventListener('keydown', (event) => {
    // ASCII-Code CR(carriage return or Enter) = 13(Decimal)
    if(event.keyCode === 13) {
        topButton.classList.add('top-button-clicked');
    }
    setTimeout(() => {
        topButton.classList.remove('top-button-clicked');
    }, 200);
});

showOrHideMenu();
window.addEventListener('resize', showOrHideMenu);

function setAtFirstSlide() {
    deactiveIndicator();
    slidesContainer.style.transitionDuration = '200ms';
    slidesContainer.style.transform = `translateX(${ -(++indexSlide) * ( 100 / MAX ) }%)`;
    indexIndicator = 0;
    activeIndicator();
    

    setTimeout(() => {
        indexSlide = 0;
        slidesContainer.style.transitionDuration = '0ms';
        slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
    }, 260);

}

function swipeLeft() {
    deactiveIndicator();

    if( indexSlide === 0 || indexSlide === (MAX - 1) ) {
        isMovingAtBegin = true;
        moveLeft();
        activeIndicator();
        return;
    }

    if( indexSlide > 0 && indexSlide < (MAX - 1) ){
        ++indexIndicator;
        indexSlide = indexIndicator;
        moveLeft();
        activeIndicator();
        return;
    }
}

function swipeRight() {
    deactiveIndicator();

    if( indexSlide === 0 || indexSlide === (MAX - 1) ) {
        isMovingAtEnd = true;
        moveRight();
        activeIndicator();
        return;
    }

    if( indexSlide > 0 && indexSlide < (MAX - 1) ) {
        --indexIndicator;
        indexSlide = indexIndicator;
        moveRight();
        activeIndicator();
        return;
    }

}

function moveToFirstSlide() {
    slidesContainer.style.transitionDuration = '0ms';
    slidesContainer.style.transform = `translateX(0%)`;
}

function moveToLastSlide() {
    slidesContainer.style.transitionDuration = '0ms';
    slidesContainer.style.transform = `translateX(${ -(MAX - 1) * ( 100 / MAX ) }%)`;
}

function swipe(touchendX) {
    clearTimeout(timeout);
    if(timeout2) {
        clearTimeout(timeout2);
    }

    if(touchendX < touchstartX) {
        swipeLeft();
    }

    if(touchendX > touchstartX) {
        swipeRight();
    }

    timeout2 = setTimeout(loop, 15000);
}

let touchstartX = null;

function getTouchstart(e) {
    touchstartX = e.changedTouches[0].pageX;
}

function getTouchend(e) {
    let touchendX = e.changedTouches[0].pageX;

    // Prevent swipe
    if(Math.abs(touchstartX - touchendX) < 100) {
        return;
    }
    
    swipe(touchendX);
}

slider.addEventListener('touchstart', getTouchstart, false);
slider.addEventListener('touchend', getTouchend, false);

timeout2 = setTimeout(loop, 15000);
