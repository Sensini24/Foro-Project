document.addEventListener("DOMContentLoaded", async() => {
    
    // initChat();
    const currentPath = window.location.pathname;
    let idPost = currentPath.split("/").pop()
    console.log("ID DE POST ACTUAL:", idPost)
    
    // Inicializar módulos según la ruta
    if (currentPath.includes('/post/addpostget')) {
        const {initAddPost} =  await import('./addPost.js')
        initAddPost();
    } 
    // Mostrar todos los posts
    else if (currentPath.startsWith('/post/') && idPost !== 'addpostget' && idPost !== 'partialAllPost') {
        const {initGetComments} = await import("./getComments.js");
        const {interactions} = await import("./contentpost.js");
        initGetComments();
        interactions();
    }
    //Mostrar los posr del usuario actual
    else if(currentPath.includes('/user/posts')){
        const {initUserPosts} = await import("./userPosts.js")
        initUserPosts();
    }
    else if(currentPath.includes('/notif/all')){
        const {initInteractNotifications} = await import("./notificationclient.js")
        initInteractNotifications();
    }

    //Módulos universales
    const {initChat} = await import("./chat.js")
    initChat()
    
    //Opciones de header como las notifications
    const {initHeaderOptions} = await import("./headerclient.js")
    initHeaderOptions()

    //Interacciones con las notifications
    // const {initInteractNotifications} = await import("./notificationclient.js")
    // initInteractNotifications()
});