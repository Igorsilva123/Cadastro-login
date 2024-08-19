import jwt from "jsonwebtoken";

export const login = ( req, res, next ) => {
  try{
    const { token } = req.body
    const { usuario } = req
    const decode = jwt.verify(token, process.env.SECRET)
    usuario = decode
  } catch(error){
    return res.status(401).json({ mensagem: "Falha na autentificação"})
  }
  
  next()
}