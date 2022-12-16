self.addEventListener('install' , function(event){
    console.log('[service workwer] is installing... ' , event)
})
self.addEventListener('activate' , function(event){
    console.log('[service workwer] is activating... ' , event);
    return self.clients.claim();
})