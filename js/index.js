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
let indicators = document.querySelectorAll('.indicator');
let slides = document.querySelectorAll('.slide');
let internalLinks = document.querySelectorAll('.internal-link');
let linkedElements = document.querySelectorAll('.linked-element');
let topButton = document.querySelector('.top-button');
let swipeArea = document.querySelector('.swipe-area');
let intervald = 15000;
let timeout;
let timeout2;
const MAX = slides.length;
let indexIndicator = 0;
let indexSlide = 0;
let isGoingLeft = false;
let isGoingRight = false;
let isStopped = false;

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

function slidingRight() {

    if( isGoingRight ) {
        indexSlide = MAX - 1;
        slidesContainer.style.transitionDuration = '0ms';
        slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
        isGoingRight = false;

        setTimeout(() => {
            deactiveIndicator();
            slidesContainer.style.transitionDuration = '2s';
            slidesContainer.style.transform = `translateX(${ -(--indexSlide) * ( 100 / MAX ) }%)`;
            indexIndicator = indexSlide;
            activeIndicator();
        }, 60);
    } else  {
        slidesContainer.style.transitionDuration = '2s';
        slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
    }
}

function slidingLeft() {

    if( isGoingLeft ) {
        indexSlide = 0;
        slidesContainer.style.transitionDuration = '0ms';
        slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
        isGoingLeft = false;

        setTimeout(() => {
            deactiveIndicator();
            slidesContainer.style.transitionDuration = '2s';
            slidesContainer.style.transform = `translateX(${ -(++indexSlide) * ( 100 / MAX ) }%)`;
            indexIndicator = indexSlide;
            activeIndicator();
        }, 60);
    } else  {
        slidesContainer.style.transitionDuration = '2s';
        slidesContainer.style.transform = `translateX(${ -indexSlide * ( 100 / MAX ) }%)`;
    }

}

function deactiveIndicator() {
    for(let element of indicators) {
        if(element.classList.contains('indicator-actived')) {
            element.classList.remove('indicator-actived');
        }
    }
}

function animationLeft() {
    slidingLeft();
    activeIndicator();
};


function animationRight() {
    slidingRight();
    activeIndicator();
};

let loop = function incrementIndex() {
    goLeft();
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
        if(timeout2 !== undefined || timeout2 !== null) {
            clearTimeout(timeout2);
        }

        deactiveIndicator();

        indexIndicator = indexSlide = i;

        animationLeft();

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

function goLeft() {
    deactiveIndicator();

    if( indexSlide === 0 || indexSlide === (MAX - 1) ) {
        isGoingLeft = true;
        animationLeft();
        activeIndicator();
        return;
    }

    if( indexSlide >= 0 && indexSlide < (MAX - 1) ){
        ++indexIndicator;
        indexSlide = indexIndicator;
        animationLeft();
        activeIndicator();
        return;
    }
}

function goRight() {
    deactiveIndicator();

    if( indexSlide === 0 || indexSlide === (MAX - 1) ) {
        isGoingRight = true;
        animationRight();
        activeIndicator();
        return;
    }

    if( indexSlide > 0 && indexSlide < (MAX - 1) ) {
        --indexIndicator;
        indexSlide = indexIndicator;
        animationRight();
        activeIndicator();
        return;
    }

}

function swipe() {
    clearTimeout(timeout);
    if(timeout2 !== undefined || timeout2 !== null) {
        clearTimeout(timeout2);
    }

    if(touchendX < touchstartX) {
        goLeft();
    }

    if(touchendX > touchstartX) {
        goRight();
    }

    timeout2 = setTimeout(loop, 15000);
}

let touchstartX = 0;
let touchendX = 0;

function getTouchstart(e) {
    e.preventDefault();
    touchstartX = e.changedTouches[0].screenX;
}

function getTouchend(e) {
    e.preventDefault();
    touchendX = e.changedTouches[0].screenX;
    swipe();
}

swipeArea.addEventListener('touchstart', getTouchstart);
swipeArea.addEventListener('touchend', getTouchend);

timeout2 = setTimeout(loop, 15000);
