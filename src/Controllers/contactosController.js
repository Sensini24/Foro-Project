import { Contact } from "../Models/ContactModel.js";

const contactModel = Contact
export const saveContact = (req, res)=>{
    const {owner_id, contact_id, estado} = req.body;
    try{
        const newContact = contactModel({
            "owner_id":owner_id,
            "contact_id": contact_id,
            "estado": estado,
            "isFavorite": false,
            "date": new Date()
        })
        
        newContact.save()
        .then(doc => console.log("Contacto guardado exitosamente", doc))
        .catch(error=> console.log("Error al guardar el contacto", error));

        res.status(201).json({message: "Contacto guardado correctamente"});
    }catch(err){
        res.status(404).json({mesagge:"No se guardo el contaco"});
    }

}