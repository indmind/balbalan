document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.hash.substr(1).split('/')[0];

  loadPage(page || 'home');

  requestNotificationPermission();
});

// eslint-disable-next-line no-unused-vars
function setPage(page, replace = false) {
  if (history.pushState) {
    window.history[replace ? 'replaceState' : 'pushState'](
        {urlPath: `/#/${page}`},
        '',
        `/#/${page}`,
    );
  }
}

async function loadPage(pageName) {
  try {
    const page = `src/pages/${pageName}/${pageName}`;

    await loadPageView(page);
    loadPageController(page);
  } catch (e) { }

  async function loadPageView(page) {
    const content = document.querySelector('#body-content');
    const styleElement = document.createElement('link');

    styleElement.type = 'text/css';
    styleElement.rel = 'stylesheet';

    try {
      const response = await fetch(`${page}.html`);

      if (response.ok) {
        styleElement.href = `${page}.css`;
        document.head.appendChild(styleElement);
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

  function loadPageController(page) {
    const scriptLoc = `${page}.js`;
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
}


async function requestNotificationPermission() {
  if ('Notification' in window) {
    const result = await Notification.requestPermission();

    if (result === 'denied') {
      console.log('Fitur notifikasi tidak diijinkan.');
      return;
    } else if (result === 'default') {
      console.error('Pengguna menutup kotak dialog permintaan ijin.');
      return;
    }

    if (('PushManager' in window)) {
      const registration = await navigator.serviceWorker.getRegistration();

      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          // eslint-disable-next-line max-len
          applicationServerKey: 'BFmj0gnaW_86Z3DwnEE4fA8UoqKroBNPrzjlFTMq48zu5JEYrGs6Ofi1HrPCVSubhqtuKW_UO-A88BLqTelAzjM',
        });

        console.log('Endpoint: ', subscription.endpoint);
        console.log('p256dh key: ', btoa(String.fromCharCode.apply(
            null, new Uint8Array(subscription.getKey('p256dh')))));
        console.log('auth key: ', btoa(String.fromCharCode.apply(
            null, new Uint8Array(subscription.getKey('auth')))));
      } catch (error) {
        console.log('Tidak dapat melakukan subscribe ', error.message);
      }
    }
  }
}
