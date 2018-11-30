window.onload = function(){
	// firebaseコンフィグ
	var config = {
		apiKey: "AIzaSyBqtqrnzRPl8swfPwvlwlC7CfkAL5J6-zA",
		authDomain: "big-apple-f214e.firebaseapp.com",
		databaseURL: "https://big-apple-f214e.firebaseio.com",
		projectId: "big-apple-f214e",
		storageBucket: "big-apple-f214e.appspot.com",
		messagingSenderId: "182384246777"
	};
	
	firebase.initializeApp(config);
		
	// firestoreインスタンスの生成
	var db = firebase.firestore();
	
	// タイムスタンプの設定を記述
	var setting = { timestampsInSnapshots:true };
	db.settings(setting);
	
	// firebaseメッセージの作成
	var messaging = firebase.messaging();

	
	// イベント取得クリック時
	document.getElementById("get_btn").onclick = function() {
		// 初期化
		document.getElementById("canvas").innerHTML = ""
		
		// イベント全件取得
		db.collection("events").get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				document.getElementById("canvas").innerHTML += 
					doc.get('event_date');;
				document.getElementById("canvas").innerHTML +=
					doc.get('event_name'); + " <br /> ";
				document.getElementById("canvas").innerHTML += "<hr />";
			});
		});
	};
	
	// // イベント追加クリック時
	document.getElementById("write_btn").onclick = function() {
		// フォームから値を取得
		var event_title = document.getElementById("event_title").value;
		var event_date  = document.getElementById("event_date").value;
		event_date = modEventDate(event_date);
		
		// 日付を取得
		var now = getNowDate();
		
		// イベント追加
		addEvent(db, "events", event_title, event_date, now);
		
		// フォームの初期化
		document.getElementById("event_title").value = "";
		document.getElementById("event_date").value = "";
	};
	
	// token取得クリック時
	document.getElementById("gettoken_btn").onclick = function() {
		requestPermission(messaging);
	};
	
	
	// 通知許可ウィンドウ
	//Notification.requestPermission(function(status) {
	//	console.log("通知の許可:", status); //コンソールに許可されたかどうかを表示
	//});
	

};

// イベント追加関数
function addEvent(db, doc, name, date, now){
	db.collection(doc).add({
		event_name: name,
		event_date: date,
		update_date: now,
	});
}
// 日付フォーマット変更処理
function modEventDate(date){
	var result = date.replace("-", "/");
	
	// "-"が存在する限り繰り返し
	while(result !== date) {
		date = date.replace("-", "/");
		result = result.replace("-", "/");
	}
	
	return date;
}

// 現在時刻の取得関数
function getNowDate(){
	var date = new Date();
	var now =[date.getFullYear(),
				date.getMonth() + 1,
				date.getDate()].join( '/' );
	
	return now;
}

function requestPermission(messaging) {
	//プッシュ通知の許可をする処理
	console.log('Requesting permission...');
	// [START request_permission]
	messaging.requestPermission().then(function() {
	console.log('Notification permission granted.');
	// TODO(developer): Retrieve an Instance ID token for use with FCM.
	// [START_EXCLUDE]
	// In many cases once an app has been granted notification permission, it
	// should update its UI reflecting this.
	viewToken(messaging);
	// [END_EXCLUDE]
	}).catch(function(err) {
		console.log('Unable to get permission to notify.', err);
	});
	// [END request_permission]
}


function viewToken(messaging){
	messaging.getToken().then(function(currentToken) {
	console.log(currentToken);
	if (currentToken) {
		console.log('トークンにゃ : '+ currentToken);//フキダシにトークンを表示。
	}
	else{
		// Show permission request.
		console.log('No Instance ID token available. Request permission to generate one.');
		// Show permission UI.
		updateUIForPushPermissionRequired();
		setTokenSentToServer(false);
	}
	}).catch(function(err) {
		console.log('An error occurred while retrieving token. ', err);
		showToken('Error retrieving Instance ID token. ', err);
		setTokenSentToServer(false);
	});
}