importScripts('https://www.gstatic.com/firebasejs/5.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.6.0/firebase-messaging.js');

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: './img/BIG_APPLE.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});


// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});


// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {});

// 通知を受け取ったときの処理
self.addEventListener("push", function(event) {
  console.log("Push Notification Recieved", event);
  if (Notification.permission == "granted") {
    event.waitUntil(
      self.registration
        .showNotification("受信しました", {
          body: "お知らせです。",
          icon: "./img/BIG_APPLE.png"
        })
        .then(
          function(showEvent) {},
          function(error) {
            console.log(error);
          }
        )
    );
  }
});

// プッシュ通知クリック時の処理
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://hiro-ryo.github.io/test/")
  );
});