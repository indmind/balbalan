const webPush = require('web-push');
const vapidKeys = require('./vapid.json');

console.log(JSON.stringify(vapidKeys, null, 2));

webPush.setVapidDetails(
    'mailto:tioirawan063@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey,
);

// digunakan untuk menentukan client
const pushSubscription = {
  'endpoint': 'https://fcm.googleapis.com/fcm/send/fhNy5TtFKGo:APA91bFpiVj_H2mMMGldgnZAWIKP-FNPTNw80I4XxOgNGXhDg0b0lxk1AdrdluAX3gl9koYpxccl7WFYOwmgiGani3uhCot2HqobKh7wbwKo8w_hMF-r7Nu4hQ-iThINXIafu_k4-UJY',
  'keys': {
    'p256dh': 'BFhrsFyIz00dzDa1GANinNTIR0coBpmZ4qM53nN9NabJdqhV4Jg7frLpDUPhNL/cvZXyNpxx27B9mMmVRRdBLp4=',
    'auth': 'GOYaz+w6nQZ+HwlkQNvD7A==',
  },
};

const payload = 'Haloo :"';

const options = {
  gcmAPIKey: '173635432825',
  TTL: 60,
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options,
);
