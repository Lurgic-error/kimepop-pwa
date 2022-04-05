console.log('Service worker loaded')

self.addEventListener('push', e => {
    const data = e.data.json()
    console.log("Push notification has been recieved...")
    self.registration.showNotification(data.title, {
        body:`${data.body} \n Amini Kwamba`,
        icon:'./gestures.png'
    })
})