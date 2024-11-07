export function initUserPosts(){
    const puntos = document.querySelectorAll("#puntos")
    const deletePost = document.getElementById("delete")
    const savePost = document.getElementById("save")
    const containerMore = document.getElementById("menu-post")
    
    puntos.forEach(punto=>{
        punto.addEventListener("click", ()=>{
            console.log("MAS OPCIONES CLICADO")
            if(containerMore.style.display === "none"){
                containerMore.style.display ="block"
            }else{
                containerMore.style.display ="none"
            }
        })
    })
    
}