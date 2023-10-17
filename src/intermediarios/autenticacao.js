const jwt = require('jsonwebtoken')
const { senhaJWT } = require('../dados/env')
const { usuarioPorID } = require('../bancodedados/bd')

const autenticarUsuario =  async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({menssagem: 'Não autorizado'})
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, senhaJWT)

        const usuario = await usuarioPorID(id)

        if (usuario.rowCount < 1) {
            return res.status(401).json({menssagem: 'Não autorizado'})
        }

        req.usuario = usuario.rows[0]

        next()
    } catch (erro) {
        return res.status(401).json({menssagem: 'Não autorizado'})
    }
}

module.exports = autenticarUsuario