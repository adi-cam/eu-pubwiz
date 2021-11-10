import { modifier } from 'ember-modifier';

export default modifier((element, args, { linkSelector = '', elementSelector = '', activeClass = 'active' }) => {
  // define handler
  const handler = () => {
    // get scroll offset
    const scrollOffset = document.documentElement.scrollTop;

    // get links and elements
    const links = element.querySelectorAll(linkSelector);
    const elements = document.querySelectorAll(elementSelector);

    // get elements before scroll offset
    let last = 0;
    for (const [i, element] of elements.entries()) {
      const elementOffset = element.getBoundingClientRect().top + scrollOffset;
      if (elementOffset <= scrollOffset + 5) {
        last = i - 1;
      }
    }
    if (last < 0) {
      last = 0;
    }

    // unset class
    for (const link of links) {
      link.classList.remove(activeClass);
    }

    // set class
    links[last].classList.add(activeClass);
  };

  // call handler
  handler();

  // add scroll handler
  document.addEventListener('scroll', handler);

  return () => {
    // remove scroll handler
    document.removeEventListener('scroll', handler);
  };
});
