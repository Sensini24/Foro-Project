import { initAddPost } from './addPost.js';
import { mostrarComentarios, guardarComentarios } from './getComments.js';

document.addEventListener("DOMContentLoaded", () => {
    
    const currentPath = window.location.pathname;
    let idPost = currentPath.split("/").pop()
    console.log("ID DE POST ACTUAL:", idPost)
    
    // Inicializar módulos según la ruta
    if (currentPath.includes('/post/addpostget')) {
        console.log(currentPath)
        initAddPost();
    } else if (currentPath.startsWith('/post/') && idPost !== 'addpostget') {
        console.log("Iniciando módulo de comentarios");
        mostrarComentarios(); // Sin pasar el ID como argumento
        guardarComentarios()
    }
        
});