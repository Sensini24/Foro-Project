function allPosts (){
    const containerPost = document.querySelectorAll(".post");
    containerPost.forEach(container => {
        const verMas = container.querySelector("#verMas");
        if (verMas) {
            console.log("Botón 'ver más' encontrado");
            verMas.addEventListener("click", () => {
                const idpost = container.querySelector("#idpost").textContent;
                cargarVista(`/post/${idpost}`, () => {
                    console.log("Post cargado correctamente");
                    import('./getComments.js').then(module => module.initComments());
                });
            });
        }
    });
}

// allPosts();