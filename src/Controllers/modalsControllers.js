
export const getModalChatStart = (req, res)=>{
    console.log('Ruta /partials/partial-menuChat solicitada');
    res.render('partials/ChatEJS/partial-menuChat', {layout:false});
} 

export const getSearchUser = (req, res)=>{
    console.log('Ruta /partials/ChatEJS/partial-SearchUserChat solicitada');
    res.render("partials/ChatEJS/partial-SearchUserChat", {layout:false})
}