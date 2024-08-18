import db from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
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

   if (!name) {
      return res.status(422).json({ message: 'o nome é obrigatorio' })
   };

   if (!email) {
      return res.status(422).json({ message: 'o email é obrigatorio' })
   };

   if (!password) {
      return res.status(422).json({ message: 'a senha é obrigatoria' })
   };


   let checkEmail = "SELECT * FROM usuarios WHERE email = ?";

   await db.query(checkEmail, [email], async (error, result) => {
      if (error) {
         return res.status(500).json({ error: 'Erro ao consultar o banco de dados' + error });
      }

      if (result.length) {
         return res.status(400).json({ msg: "email já cadastrado" });
      }

      await bcrypt.hash(password, salt, async (err, hashedPassword) => {
         if (err) return res.status(500).json({ error: 'Erro ao criptografar a senha' });
         let sql = "INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)";

         await db.query(sql, [name, email, hashedPassword], (error, result) => {
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
   const { email, password } = req.body;

   if (!email) {
      return res.status(422).json({ message: 'O email é obrigatório' });
   }

   if (!password) {
      return res.status(422).json({ message: 'A senha é obrigatória' });
   }

   const userQuery = "SELECT * FROM usuarios WHERE email = ?";

   db.query(userQuery, [email], async (error, data) => {
      
      if (error) {
         return res.status(500).json({ error: "Erro ao logar!" });
      }
      if (data.length < 1) {
         return res.status(401).json({ error: "Falha na autenticação" });
      }
      bcrypt.compare(password, data[0].password, (err, result) => {
         
         if (err) {
            return res.status(404).json({ error: "Erro ao comparar as senhas" });
         }
         if (result) {
            console.log(result)
            return res.status(200).json({ msg: "Autenticado com sucesso" })
         }
         return res.status(401).json({ msg: "Falha na autenticação" })

      })
      
   })
}


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

