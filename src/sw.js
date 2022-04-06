import {
    precacheAndRoute
} from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

const registerServiceWorker = () => {
    // Check for service workers
    if ('serviceWorker' in navigator) {
        console.log("service worker is here")
        send().catch(err => console.error(err))
    }

    // Register Service Worker, Register Push,  Send Push Notification
    async function send() {

        console.log('Registering service worker\n')
        // Regitser Service Worker
        const register = await navigator.serviceWorker.register('./worker.js', {
            scope: '/'
        })
        console.log('Completed registering service worker.\n')

        // Register Push
        console.log('Registering Push Notification Subscription.\n')
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        })
        console.log('Completed registering push.\n')

        // Send Push Notification
        console.log('Sending Push Notifications Subscription')
        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        })

        console.log('Completed sending push notification.\n')
    }
}



function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


export default registerServiceWorker