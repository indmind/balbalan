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
