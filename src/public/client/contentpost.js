export const interactions = ()=>{
    const cuerpopostblog = document.querySelector("#cuerpo-post-blog")
    console.log("Cuerpo de post: ", cuerpopostblog)
    cuerpopostblog.addEventListener("click", async (event)=>{
        const targeta = event.target.closest("div")
        switch(targeta.id){
            case "add-like":
                console.log("Id like clicado")
                await handlelike(cuerpopostblog)
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

const handlelike = async(cuerpopostblog)=>{
    const numerovalor = cuerpopostblog.querySelector("#like-count").textContent.trim()
    const postId = cuerpopostblog. querySelector("#id-post").textContent.trim()

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