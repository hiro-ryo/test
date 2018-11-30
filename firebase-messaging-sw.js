// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});


// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {});

importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

// firebaseCM
var messaging = firebase.messaging();

firebase.initializeApp({
	messagingSenderId: "182384246777"
});


// プッシュ通知の受け取り
self.addEventListener("push", function(event) {
	//送られたプッシュ通知の本文を表示
	if (Notification.permission == "granted") {
		console.log("Push Notification Recieved", event);
		event.waitUntil(
			self.registration
			.showNotification(event.data.json().notification.title, {
				body: event.data.json().notification.body
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