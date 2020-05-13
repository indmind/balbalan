document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.hash.substr(1).split('/')[0];

  loadPage(page || 'home');

  requestNotificationPermission();
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
      navigator.serviceWorker.getRegistration().then(function(registration) {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BFmj0gnaW_86Z3DwnEE4fA8UoqKroBNPrzjlFTMq48zu5JEYrGs6Ofi1HrPCVSubhqtuKW_UO-A88BLqTelAzjM',
        }).then(function(subscribe) {
          console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
          console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('p256dh')))));
          console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('auth')))));
        }).catch(function(e) {
          console.error('Tidak dapat melakukan subscribe ', e.message);
        });
      });
    }
  }
}
