import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Conectar a la base de datos de MongoDB
  const connect =()=> {
    mongoose.connect( process.env.MONGODB_URI , {
    }).then(() => {
      console.log('Conectado a MongoDB en la base de datos blogDB');
    }).catch((error) => {
      console.error('Error al conectar a MongoDB:', error);
    })
  }
  connect();

export default connect