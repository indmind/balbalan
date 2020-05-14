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
  'endpoint': 'https://fcm.googleapis.com/fcm/send/ek_lH3QKHlY:APA91bHujEnhBdTPATpNCRoDtwv-dPpRAa04MR4MymiKNkJkyzABA7DaTIiyP02F4HtXcR_yxG4mvMIqPVsHe55nyV7Pp7XLhf53OCkwdoYMqg0fTgunbx5WLHEuHQ24EuB3QpQRJUAl',
  'keys': {
    'p256dh': 'BC+4v78ZsIv/XZSr1Gc+1ooWNUsNCrWf3mcIOFSdaSbjIC7ITyZPdDsAIv77GvspCGSt6T3h/LtYjOwJrNLvaH8=',
    'auth': '2vM7AjPagMqpX5+Olkufeg==',
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
