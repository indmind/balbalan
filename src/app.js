import 'regenerator-runtime';

import main from './js/main';

import '../lib/js/materialize.min.js';

import './component/nav.js';
import './component/team-item.js';
import './component/team-detail.js';

if (document.readyState !== 'loading') {
  main();
} else {
  window.addEventListener('DOMContentLoaded', main);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Pendaftaran sw berhasil');
    } catch (e) {
      console.log('Pendaftaran sw gagal');
    }
  });
} else {
  console.log('sw tidak didukung');
}

