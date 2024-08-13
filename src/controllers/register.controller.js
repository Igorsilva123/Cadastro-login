import db from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const salt = 12

export const getUser = async (req, res) => {
   let sql = "SELECT * FROM usuarios"

   await db.query(sql, (error, result) => {
      if (error) {
         return error
      }
      return res.status(202).send(result)
   })
}
//registro de usuarios 
export const createUserRegister = async (req, res) => {
   const { name } = req.body;
   const { email } = req.body;
   const { password } = req.body;
   const { confirmpassword } = req.body;

   if (!name) {
      return res.status(422).json({ message: 'o nome é obrigatorio' })
   };

   if (!email) {
      return res.status(422).json({ message: 'o email é obrigatorio' })
   };

   if (!password) {
      return res.status(422).json({ message: 'a senha é obrigatoria' })
   };

   if (password !== confirmpassword) {
      return res.status(422).json({ message: 'as senhas não são iguais' })
   };

   let checkEmail = "SELECT * FROM usuarios WHERE email = ?";

   await db.query(checkEmail, [email], (error, result) => {
      if (error) {
         return res.status(500).json({ error: 'Erro ao consultar o banco de dados' + error });
      }

      if (result.length) {
         return res.status(400).json({ msg: "email já cadastrado" });
      }

      bcrypt.hash(password, salt, (err, hashedPassword) => {
         if (err) return res.status(500).json({ error: 'Erro ao criptografar a senha' });
         let sql = "INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)";

         db.query(sql, [name, email, hashedPassword], (error, result) => {
            if (error) {
               return error;
            };
            return res.status(202).send("Usuario Criado com sucesso!");

         });
      });
   });
};



//login usuários
export const loginUsers = async (req, res) => {
   const { email , password } = req.body

   if (!email) {
      return res.status(422).json({ message: 'o email é obrigatorio' })
   };

   if (!password) {
      return res.status(422).json({ message: 'a senha é obrigatoria' })
   };

   let user = "SELECT * FROM usuarios WHERE email = ?";

   await db.query(user, [email], (error, result) => {
      if (error) {
         return res.status(500).json({ error: 'Erro ao consultar o banco de dados' + error });
      }

      if (!result.length) {
         return res.status(400).json({ msg: "email incorreto!" });
      };

     const checkPassword = bcrypt.compare(password, user.password)
     if(!checkPassword){
         return res.status(400).json({ msg: "senha incorreta!" });
     }

   });
};



export const deleteUser = async (req, res) => {
   const { id } = req.params
   let sql = "DELETE FROM usuarios WHERE id = ?";

   await db.query(sql, [id], (error, result) => {
      if (error) {
         return error
      }
      return res.status(202).send("Usuario Deletado!!")

   })
}

