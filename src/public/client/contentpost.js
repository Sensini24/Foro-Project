export const interactions = async ()=>{
    const cuerpopostblog = document.querySelector("#cuerpo-post-blog")
    const idPost =document.querySelector("#id-post").textContent.trim()
    // const data = await handleCountInteractions(idPost)

    interactionsview(idPost)
    
    console.log("Cuerpo de post: ", cuerpopostblog)
    cuerpopostblog.addEventListener("click", async (event)=>{
        const targeta = event.target.closest("div")
        switch(targeta.id){
            case "add-like":
                console.log("Id like clicado")
                await handleSavelike(cuerpopostblog)
                break;
            
            case "add-dislike":
                console.log("Id dislike clicado")
                break;

            case "add-share":
                console.log("Id share clicado")
                break;
        }
    })

}

const handleSavelike = async(cuerpopostblog)=>{
    const numerovalor = cuerpopostblog.querySelector("#like-count").textContent.trim()
    const postId = cuerpopostblog.querySelector("#id-post").textContent.trim()

    const like = "like"

    try {
        const response = await fetch(`/interactions/likes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_id: postId,
                type: like
            })
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data.successMessage) {
            console.log("Interacción guardada exitosamente: ", data.result);
        } else {
            console.log("No se guardó tu interacción: ", data.error);
        }
    } catch (error) {
        console.error("Error al enviar la interacción:", error);
    }
}
    

// }
// const handleCountInteractions = async(cuerpopostblog, data)=>{
//     const idLikeCount = cuerpopostblog.querySelector("#like-count")

// }
async function interactionsview(id){
    const data = await handleCountInteractions(id)
    const idLikeCount = document.querySelector("#like-count")
    const sumLikes = data.interactionsCount[0].sumLikes
    idLikeCount.innerHTML = sumLikes

    //? Se pintará si el usuario ya dió like???

    if(!data.interactionsUser){
        return console.log("No estás logeado nadie")
    }
    const likeUserCount= data.interactionsUser[0].sumLikes
    
    // Seleccionar los botones
const addLike = document.getElementById("add-like");
const addDislike = document.getElementById("add-dislike");
const addShare = document.getElementById("add-share");

// Función para aplicar estilos iniciales
const applyStyles = (button, textClass, countId) => {
    button.style.backgroundColor = "#1A365D"; // Cambiar el fondo del botón

    const textElement = button.querySelector(textClass); // Seleccionar el texto interno
    if (textElement) textElement.style.color = "#FCD639"; // Cambiar el color del texto

    const countElement = document.getElementById(countId); // Seleccionar el contador
    if (countElement) countElement.style.color = "#FCD639"; // Cambiar el color del contador
};

    if(likeUserCount >0){
        const idaddlike = document.querySelector("#add-like")
        const classaddlike = document.querySelector(".add-like")
        applyStyles(addLike, ".add-like", "like-count"); // Aplicar estilos al botón "like"
        // applyStyles(addDislike, ".add-dislike", "dislike-count"); // Aplicar estilos al botón "dislike"
        // applyStyles(addShare, ".add-share", "share-count"); 
    }
    console.log("Data de interacciones de usuario: ", data.interactionsUser[0].sumLikes, typeof likeUserCount)
    

}
async function handleCountInteractions(id){
    try {
        const response = await fetch(`/interactions/${id}`);
    
        if (!response.status===200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data) {
            console.log("Se obtuviero las interacciones: ", 
                "Cantidad de interacciones total: ", data.interactionsCount, 
                "Cantidad de interacciones por usuario: ", data.interactionsUser);
            return data
        } else {
            console.log("No se obtuvieron las interacciones: ", data.interactionsCount);
        }
    } catch (error) {
        console.error("Error al enviar la interacción:", error);
    }
}


// async function handleCountInteractions (id){
//     try {
//         const response = await fetch(`/interactions/${id}`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 post_id: postId,
//                 type: like
//             })
//         });
    
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
    
//         const data = await response.json();
    
//         if (data.successMessage) {
//             console.log("Interacción guardada exitosamente: ", data.result);
//         } else {
//             console.log("No se guardó tu interacción: ", data.error);
//         }
//     } catch (error) {
//         console.error("Error al enviar la interacción:", error);
//     }
// }