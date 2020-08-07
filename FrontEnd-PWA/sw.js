const staticCacheName = 'site-static'
const assets = [
    'index.html',
    'js/app.js',
    'js/ui.js',
    'js/materialize.min.js',
    'css/styles.css',
    'css/materialize.min.css',
    'img/books-200x200.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', evt => {
    console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                console.log('caching shell assets');
                cache.addAll(assets)
                .then(()=>{console.log("Precaching completed");})
                .catch(err=>{console.log("Error Precaching", err);})
            })
            .catch(err => {
                console.log('Error opening cache', err)
            })
    );
});


self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
});

self.addEventListener('fetch', evt=>{
    console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    )
});