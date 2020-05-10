if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/service-worker.js")
      console.log("Pendaftaran sw berhasil")
    } catch (e) {
      console.log("Pendaftaran sw gagal")
    }
  })
} else {
  console.log("sw tidak didukung")
}

document.addEventListener('DOMContentLoaded', () => {
  M.Sidenav.init(
    document.querySelectorAll('.sidenav'),
  );
  
  loadNav();

  loadPage(
    window.location.hash.substr(1) || 'home',
  );

  async function loadNav() {
    const response = await fetch('src/component/nav.html');

    if (!response.ok) return;

    const responseText = await response.text();

    document.querySelectorAll('.topnav, .sidenav').forEach(
      (element) => element.innerHTML = responseText,
    );

    document.querySelectorAll('.sidenav a, .topnav a').forEach((element) => {
      element.addEventListener('click', (event) => {
        M.Sidenav.getInstance(
          document.querySelector('.sidenav'),
        ).close();

        loadPage(
          event.target.getAttribute('href').substr(1),
        );
      });
    });
  }
});

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


