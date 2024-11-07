
export const getTags = async(req, res)=>{
    try{
        console.log("Interfaz partial obtenido")
        res.render("partials/partial-tags",{layout:false})
    }catch(error){
        console.log("NO cargado tags")
        res.send.status(404);
    }
}

export const getAtajos = async(req, res)=>{
    try{
        res.render("partials/partial-atajos",{layout:false})
    }catch(error){
        console.log("NO se cargaron los atajos")
        res.send.status(404);
    }
}