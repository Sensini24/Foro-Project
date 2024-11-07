export const getLayout = (req, res)=>{
    try{
        console.log("Layout cargado exitosamente")
    res.render("layout")
    }catch(err){
        console.error(err)
    }
    
}