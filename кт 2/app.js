// 1. Получение местоположения
document.getElementById('getLocation').onclick = function() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    document.getElementById('coordinates').innerText =
    Широта: ${latitude}, Долгота: ${longitude};
    window.localStorage.setItem('lastLocation', JSON.stringify({ latitude, longitude }));
    });
    } else {
    alert("Geolocation is not supported by this browser.");
    }
    };
    // 2. Работа с LocalStorage
    document.getElementById('saveLocalStorage').onclick = function() {
    const comment = document.getElementById('comment').value;
    const lastLocation = window.localStorage.getItem('lastLocation');
    if (comment && lastLocation) {
    const locationData = JSON.parse(lastLocation);
    const comments = JSON.parse(window.localStorage.getItem('comments')) [];
    comments.push({ comment, location: locationData });
    window.localStorage.setItem('comments', JSON.stringify(comments));
    document.getElementById('comment').value = '';
    showLocalStorageComments();
    }
    };
    function showLocalStorageComments() {
    const comments = JSON.parse(window.localStorage.getItem('comments')) [];
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    comments.forEach((item) => {
    const li = document.createElement('li');
    li.innerText = Комментарий: ${item.comment}, Широта: ${item.location.latitude}, Долгота: ${item.location.longitude};
    commentsList.appendChild(li);
    });
    }
    showLocalStorageComments(); // Показываем комментарии при загрузке
    //3. Работа с IndexedDB
    const dbName = 'CommentsDB';
    const storeName = 'commentsStore';
    let db;
    // Открываем IndexedDB
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('comment', 'comment', { unique: false });
    objectStore.createIndex('location', 'location', { unique: false });
    };
    request.onsuccess = function(event) {
    db = event.target.result;
    showIndexedDBComments();
    };
    document.getElementById('saveIndexedDB').onclick = function() {
    const comment = document.getElementById('comment').value;
    const lastLocation = window.localStorage.getItem('lastLocation');
    if (comment && lastLocation) {
    const locationData = JSON.parse(lastLocation);
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    objectStore.add({ comment, location: locationData });
    transaction.oncomplete = function() {
    document.getElementById('comment').value = '';
    showIndexedDBComments();
    };
    }
    };
    function showIndexedDBComments() {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();
    request.onsuccess = function(event) {
    const comments = event.target.result;
    const indexedDBList = document.getElementById('indexedDBList');
    indexedDBList.innerHTML = '';
    comments.forEach((item) => {
    const li = document.createElement('li');
    li.innerText = Комментарий: ${item.comment}, Широта: ${item.location.latitude}, Долгота: ${item.location.longitude};
    indexedDBList.appendChild(li);
    });
    };
    }