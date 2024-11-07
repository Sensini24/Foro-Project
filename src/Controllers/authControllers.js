import { render } from "ejs";
import { User } from "../Models/User.js";
import { crearWebToken } from "./utils.js";
import { response } from "express";
import multer from "multer";
import path from "path"

// const upload = multer({dest: "src/public/Images/avatar"})

const model = User;

export const getlogin=(req, res)=>{
    
    res.render("login", { layout: false })
}

export const getsignup=(req, res)=>{
    
    res.render("sign-up", { layout: false })
}

export const userlogin = async(req, res)=>{
    const { email, password } = req.body;
    
    if (email=="" || password== "") {
       console.log('Email y contraseña son requeridos.')
       return res.status(400).json({message:"Se requiere la contraseña y el password"})
    }
    
    const emailmatch = await model.find({$and:[{email: email}, {password:password}]})

    if(emailmatch.length == 0){
        console.log("Contraseña o email incorrectos")
        return res.status(400).json({message:"Contraseña o email incorrectos"})
    }

    const [usuario] = await model.find({email: email})

    const token = await crearWebToken(usuario)
    // console.log("Token: ", token)

    res.cookie('authToken', token, { httpOnly: true, sameSite: 'Strict' }); 

    return res.json({success: true, message: "Inicio de sesión exitoso" });
    
}

export const userRegister = async(req, res)=>{
    const {username, email, password } = req.body
    console.log(username, email, password)
    try {
        let mensaje = ""
        if(username == "" || email ==  "" || password == "" ){
            mensaje = "Ingrese todas las crendeciales"
            res.redirect("/auth/sign-up", {mensaje})
        }

        if(req.body.length == 0 ){
            mensaje = "No se obtuvo los datos de usuario"
            res.redirect("/auth/sign-up", {mensaje})
        } 

        const nuevoUsuario = new model({user_name: username, email:email, password:password})

        const guardarUsuario = await nuevoUsuario.save();

        res.redirect("/auth/login")
    } catch (error) {
        res.status(400).send(`Error de registro de usuario: ${error.message}`);
    }
}

export const logoutUser = (req, res) => {
    // Limpia la cookie, asegurando que los parámetros coincidan con la configuración original
    res.clearCookie('authToken', { httpOnly: true, sameSite: 'Strict' });
    console.log("Token borrado")
    res.redirect('/auth/login');
};

//* Uso de multer para adjudicar lugar de guardado de files, mas el nombre
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/Images/avatar'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
    }
  });

  //* Se crea una variable y se la exporta para que sirve como middleware previa a upload Image
  //* Este es el que guarda la imagen dentro de la ruta especificada
export const upload = multer({ storage: storage });

//* Método para guardar el archivo
export const uploadImageProfile = async (req, res)=>{
    try {

        const datapayload = req.usuariodatospayload
        const usuarioid = datapayload._id
        const filePath =  req.file.path.replace("public", "")
        console.log("PATH NUEVO: ", filepath)
        try {
            const updateuser = await model.updateOne({ _id: usuarioid }, { $set: { profilePic: filePath } });
        
            if (updateuser.modifiedCount > 0) {
                console.log("Usuario modificado")
            } else {
                console.log("NO se pudo modificar usuario")
            }
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
        console.log("FILE: ", req.file)
        res.status(200).json({message:'Imagen subida y guardada', file: req.file.path});
      } catch (error) {
        res.status(400).json({message:'Error al subir la imagen'});
      }
      
}

//! Aqui se puede colocar un servicio o un repositorio para obtener el usuario por id.
export const UserCharge= async (req, res)=>{
    const payload = req.usuariodatospayload || null
    if(!payload){
        return res.status(400).json({message:"Ningún usuario logeado"})
    }
    const id_usuario = payload._id
    const usuario = await model.findOne({_id:id_usuario})
    console.log("Usuario de carga: ", usuario)
    return res.status(200).json({message:"Payload Obtenido", usuario:usuario.profilePic})
}