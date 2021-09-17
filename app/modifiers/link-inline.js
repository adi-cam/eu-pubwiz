import { modifier } from 'ember-modifier';

export default modifier((element) => {
  // prepare handler
  const handler = (e) => {
    e.preventDefault();

    // get hash
    const hash = e.target.hash;

    // scroll smooth
    document.documentElement.scrollTo({
      top: 0,
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
