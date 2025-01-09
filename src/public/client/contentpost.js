
export const interactions = async ()=>{
    const socket = initializeSocket();


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
                await handleSaveInteracction(cuerpopostblog, "like", socket)
                break;
            
            case "add-dislike":
                console.log("Id dislike clicado")
                await handleSaveInteracction(cuerpopostblog, "dislike", socket)
                break;

            case "add-share":
                console.log("Id share clicado")
                break;
        }
    })

}

function initializeSocket() {
    return io({
        auth: {
            serverOffset: 0
        }
    });
}


const handleSaveInteracction = async(cuerpopostblog, type, socket)=>{
    let numerovalor = cuerpopostblog.querySelector("#like-count").textContent
    const postId = cuerpopostblog.querySelector("#id-post").textContent.trim()
    const usuarioUserPost = cuerpopostblog.querySelector(".blog-author").textContent.trim()
    const postName = cuerpopostblog.querySelector("#title-post").textContent.trim()

    console.log("NOMBRE DE POST: ", postName)
    //Determinar que interaccion entre like o dislike tiene el usuario
    const whatInteracction = await handleCountInteractions(postId)
    if(!whatInteracction.interactionsUser){
        return console.log("No estás logeado. Registrate para poder interactuar")
    }
    const likeUserCount= whatInteracction.interactionsUser[0].sumLikes
    const dislikeUserCount = whatInteracction.interactionsUser[0].sumDislikes

    const validationTypeLike = likeUserCount > 0 
    const validationTypeDislike = dislikeUserCount > 0

    const totalLikesCount = whatInteracction.interactionsCount[0]?.sumLikes
    const totalDislikesCount = whatInteracction.interactionsCount[0]?.sumDislikes

    

    // Seleccionar los botones
    const addLike = document.getElementById("add-like");
    const addDislike = document.getElementById("add-dislike");

    // applyStyles(addLike, ".add-like", "like-count");
    // applyStyles(addDislike, ".add-dislike", "dislike-count")
    // removeCompleteStyles(addDislike, ".add-dislike", "dislike-count")


    const likeCountElement = document.querySelector("#like-count");
    const dislikeCountElement = document.querySelector("#dislike-count");
    if(validationTypeLike){
        //! Si ya tiene like y da like otra vez se elimina el like.
        if(type === "like"){
            handleDeleteInteraction(postId, type)
            console.log("Ya no te gusta el post")
            removeCompleteStyles(addLike, ".add-like", "like-count");
            console.log("Contenido actual de numerovalor:", numerovalor); 
            
            //TODO: Aqui solo quito a like
            updateInteractionCount(likeCountElement,-1);

        //! Si ya tiene like y da dislike; se elimina el like y activa el dislike.
        }else if(type ==="dislike"){
            handleDeleteInteraction(postId, "like") 
            fetchSaveInteraction(postId, type)
            console.log("Diste dislike al post")
            applyStyles(addDislike, ".add-dislike", "dislike-count")
            removeCompleteStyles(addLike, ".add-like", "like-count");

            //TODO: AQui quito a like y sumo a dislike
            updateInteractionCount(likeCountElement,-1);
            updateInteractionCount(dislikeCountElement,1);
        }
    }else if(validationTypeDislike){
        //! Si ya tiene dislike y da dislike; se elimina el dislike.
        if(type === "dislike"){
            handleDeleteInteraction(postId, type)
            removeCompleteStyles(addDislike, ".add-dislike", "dislike-count");

            //TODO: AQui quito a dislike
            updateInteractionCount(dislikeCountElement,-1);
            console.log("Que bueno, creo que le quieres dar otra oporotunidad al post")

        //! Si ya tiene dislike y da like; se elimina el dislike y activa el like.
        }else if(type==="like"){
            handleDeleteInteraction(postId, "dislike")
            fetchSaveInteraction(postId, type)
            console.log("Parece que te lo pensaste y te gusto")
            applyStyles(addLike, ".add-like", "like-count")
            removeCompleteStyles(addDislike, ".add-dislike", "dislike-count");
            //TODO: AQui quito a dislike
            updateInteractionCount(likeCountElement,1);
            updateInteractionCount(dislikeCountElement,-1);

            socket.emit("newLike notification", usuarioUserPost, postName);
            console.log("NOmbre de ususario enviado: ", usuarioUserPost, postName)
        }
    }else if(!validationTypeLike && !validationTypeDislike){
        if(type==="like"){
            fetchSaveInteraction(postId, type)
            applyStyles(addLike, ".add-like", "like-count")
            updateInteractionCount(likeCountElement,1);
            socket.emit("newLike notification", usuarioUserPost, postName);
            console.log("NOmbre de ususario enviado: ", usuarioUserPost, postName)
        }else if(type==="dislike"){
            fetchSaveInteraction(postId, type)
            applyStyles(addDislike, ".add-dislike", "dislike-count")
            updateInteractionCount(dislikeCountElement,1);
        }
    }
    // const like = "like"

    
}

function updateInteractionCount(element, increment) {
    try {
        if (!element) {
            console.error('Elemento no encontrado');
            return;
        }

        const currentLikes = parseInt(element.textContent.trim(), 10) || 0;

        //* Aqui se incrementa o reduce los likes
        const newLikes = Math.max(0, currentLikes + increment);
        
        element.textContent = newLikes.toString();

    } catch (error) {
        console.error('Error al actualizar los likes:', error);
    }
}


const fetchSaveInteraction = async(postId, type)=>{
    try {
        const response = await fetch(`/interactions/likes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_id: postId,
                type: type
            })
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data)
        if (data.successmessage) {
            console.log("Interacción guardada exitosamente: ", data.successmessage);
        } else {
            console.log("No se guardó tu interacción: ", data.error);
        }
    } catch (error) {
        console.error("Error al enviar la interacción:", error);
    }
}

async function handleCountInteractions(id){
    try {
        const response = await fetch(`/interactions/${id}`);
    
        if (response.status!==200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data) {
            // console.log("Se obtuviero las interacciones: ", 
            //     "Cantidad de interacciones total: ", data.interactionsCount, 
            //     "Cantidad de interacciones por usuario: ", data.interactionsUser);
            return data
        } else {
            console.log("No se obtuvieron las interacciones: ", data.interactionsCount);
        }
    } catch (error) {
        console.error("Error al enviar la interacción:", error);
    }
}
async function interactionsview(id){
    const data = await handleCountInteractions(id)
    const idLikeCount = document.querySelector("#like-count")
    const idDislikeCount = document.querySelector("#dislike-count")
    const sumLikes = data.interactionsCount[0]?.sumLikes
    const sumDislikes = data.interactionsCount[0]?.sumDislikes
    idLikeCount.innerHTML = sumLikes
    idDislikeCount.innerHTML = sumDislikes

    //? Se pintará si el usuario ya dió like???
    if(!data.interactionsUser){
        return console.log("No estás logeado nadie")
    }

    // if(!data.interactionsUser|| data.interactionsUser === null || data.interactionsUser.length <0){
    //     console.log("NO se obtuvieron datos de usuaurio")
    // }
    const likeUserCount= data.interactionsUser[0].sumLikes
    console.log("NUmero de likes de usuario: ", likeUserCount)

    const dislikeUserCount= data.interactionsUser[0].sumDislikes
    console.log("NUmero de dislikes de usuario: ", dislikeUserCount)
    //const dislikeUserCount = data.interactionsUser[0].sumDislikes

    // Seleccionar los botones
    const addLike = document.getElementById("add-like");
    const addDislike = document.getElementById("add-dislike");
    const addShare = document.getElementById("add-share");

    
    if(likeUserCount >0){
        applyStyles(addLike, ".add-like", "like-count"); // Aplicar estilos al botón "like"
        
        // applyStyles(addShare, ".add-share", "share-count"); 
    }else if(dislikeUserCount>0){
        applyStyles(addDislike, ".add-dislike", "dislike-count"); // Aplicar estilos al botón "dislike"
    }
    console.log("Data de interacciones de usuario: ", data.interactionsUser[0].sumLikes, typeof likeUserCount)
    

}

// Función para aplicar estilos iniciales
// const applyStyles = (button, textClass, countId) => {
//     button.style.backgroundColor = "#1A365D"; // Cambiar el fondo del botón

//     const textElement = button.querySelector(textClass); // Seleccionar el texto interno
//     if (textElement) textElement.style.color = "#FCD639"; // Cambiar el color del texto

//     const countElement = document.getElementById(countId); // Seleccionar el contador
//     if (countElement) countElement.style.color = "#FCD639"; // Cambiar el color del contador
// };

const applyStyles = (button, textClass, countId) => {
    button.classList.add("active-button"); // Añadir clase adicional para el botón

    const textElement = button.querySelector(textClass); // Seleccionar el texto interno
    if (textElement) textElement.classList.add("active-text"); // Añadir clase adicional para el texto
    // console.log("elementtet: ", textElement)
    const countElement = document.getElementById(countId); // Seleccionar el contador
    
    if (countElement) countElement.classList.add("active-count"); // Añadir clase adicional para el contador
    console.log("elementcount: ", countElement)
};


const removeCompleteStyles = (button, textClass, countId) => {
    button.classList.remove("active-button"); // Remover clase adicional del botón

    const textElement = button.querySelector(textClass); // Seleccionar el texto interno
    if (textElement) textElement.classList.remove("active-text"); // Remover clase adicional del texto

    const countElement = document.getElementById(countId); // Seleccionar el contador
    if (countElement) countElement.classList.remove("active-count"); // Remover clase adicional del contador
};


async function handleDeleteInteraction(id, type){
    try {
        const response = await fetch(`/interactions/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_id: id,
                type: type
            })
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data.successmessage) {
            console.log("Interacción guardada exitosamente: ", data.successmessage);
        } else {
            console.log("No se guardó tu interacción: ", data.error);
        }
    } catch (error) {
        console.error("Error al enviar la interacción:", error);
    }
        
}