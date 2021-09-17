import { modifier } from 'ember-modifier';

export default modifier((element) => {
  // prepare handler
  const handler = (e) => {
    // get hash
    const hash = e.target.hash;

    // find element
    const element = document.documentElement.querySelector(hash);
    if (!element) {
      return;
    }

    // prevent default
    e.preventDefault();

    // get offset
    const offset = element.getBoundingClientRect().top + document.documentElement.scrollTop;

    // scroll smooth
    document.documentElement.scrollTo({
      top: offset,
      left: 0,
      behavior: 'smooth',
    });

    // update location
    if (history.pushState) {
      history.pushState(null, null, hash);
    } else {
      location.hash = hash;
    }
  };

  // add event listener
  element.addEventListener('click', handler);

  return () => {
    // remove scroll handler
    document.removeEventListener('click', handler);
  };
});
