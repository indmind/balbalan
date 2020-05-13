import homePage from '../pages/home';

export default () => {
  const page = window.location.hash.substr(1).split('/')[0];

  loadPage(page || 'home');

  async function loadPage(page) {
    try {
      const content = document.querySelector('#body-content');

      switch (page) {
        case 'home':
          content.innerHTML = homePage.template;
          homePage.created();
          break;
      }
    } catch (e) { }
  }
};
