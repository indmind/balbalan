document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.hash.substr(1).split('/')[0];

  loadPage(page || 'home');
});

// eslint-disable-next-line no-unused-vars
function setPage(page, replace = false) {
  if (history.pushState) {
    window.history[replace ? 'replaceState': 'pushState'](
        {urlPath: `/#/${page}`},
        '',
        `/#/${page}`,
    );
  }
}

async function loadPage(page) {
  try {
    await loadPageView(page);
    loadPageController(page);
  } catch (e) { }

  function loadPageController(page) {
    const scriptLoc = `src/pages/${page}/${page}.js`;
    const prevScript = document.getElementById('content-controller');

    if (prevScript) {
      if (prevScript.src != scriptLoc) {
        prevScript.parentNode.removeChild(prevScript);
      }
    }

    const script = document.createElement('script');

    script.setAttribute('id', 'content-controller');
    script.src = scriptLoc;

    document.body.appendChild(script);
  }

  async function loadPageView(page) {
    const content = document.querySelector('#body-content');

    try {
      const response = await fetch(`src/pages/${page}/${page}.html`);

      if (response.ok) {
        content.innerHTML = await response.text();
      } else {
        content.innerHTML = await fetch('src/pages/404.html').then(
            (response) => response.text(),
        );
      }
    } catch (e) {
      content.innerHTML = await fetch('src/pages/404.html').then(
          (response) => response.text(),
      );
    }
  }
}


