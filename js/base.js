window.onload = function(){
	
	// FirebaseUIインスタンス初期化
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	
	// FirebaseUIの各種設定
	var uiConfig = {
		callbacks: {
			signInSuccess: function(currentUser, credential, redirectUrl) {
				// サインイン成功時のコールバック関数
				// 戻り値で自動的にリダイレクトするかどうかを指定
				
				document.getElementById('loader').style.display = 'block';
				
				return true;
			},
			uiShown: function() {
				// FirebaseUIウィジェット描画完了時のコールバック関数
				// 読込中で表示しているローダー要素を消す
				document.getElementById('loader').style.display = 'none';
			}
		},
		 // リダイレクトではなく、ポップアップでサインインフローを表示
		signInFlow: 'popup',
		signInSuccessUrl: '<url-to-redirect-to-on-success>',
		signInOptions: [
			// サポートするプロバイダ(メールアドレス)を指定
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
		],
		// Terms of service url.(サービス利用規約ページの)
		tosUrl: '<your-tos-url>'
	};
	
	
	// FirebaseUI描画開始
	ui.start('#firebaseui-auth-container', uiConfig);
	
	
	
	
	// firestoreインスタンスの生成
	var db = firebase.firestore();
	
	// タイムスタンプの設定を記述
	var setting = { timestampsInSnapshots:true };
	db.settings(setting);
	
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
	
	// イベント追加クリック時
	document.getElementById("add_btn").onclick = function() {
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
	
	// メッセージ機能を定義
	const messaging = firebase.messaging();
	// push証明書を紐つけ
	messaging.usePublicVapidKey("BEAl0HPrBGEYZpC_ueHQDmHkTTiniie2cPLTh7q90asdo9pneVNhtD4SssxUbUW9hTx0Z2F1YZ8w9GOQggJoygM ");
	// 通知を受信許可を確認
	messaging.requestPermission().then(function() {
		console.log('Notification permission granted.');
		// TODO(developer): Retrieve an Instance ID token for use with FCM.
	}).catch(function(err) {
		console.log('Unable to get permission to notify.', err);
	});
	
	//var token = messaging.getToken()
	//console.log(token);
	
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

