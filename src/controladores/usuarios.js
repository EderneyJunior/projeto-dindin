const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { verificarEmail, criarUsuario, existeEmailForaUsuarioLogado, atualizarUsuario } = require('../bancodedados/bd')
const { senhaJWT } = require('../dados/env')

const cadastrarUsuario =  async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({menssagem: 'O nome é obrigatório'})
    }

    if (!email) {
        return res.status(400).json({menssagem: 'O email é obrigatório'})
    }

    if (!senha) {
        return res.status(400).json({menssagem: 'A senha é obrigatória'})
    }

    try {
        const existeEmail = await verificarEmail(email)

        if (existeEmail.rowCount > 0) {
            return res.status(400).json({menssagem: 'Já existe usuário cadastrado com o e-mail informado'})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await criarUsuario(nome, email, senhaCriptografada)

        return res.status(201).json(novoUsuario)
    } catch (erro) {
        return res.status(500).json({menssagem: 'Erro interno no servidor'})
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    if (!email) {
        return res.status(400).json({menssagem: 'O email é obrigatório'})
    }

    if (!senha) {
        return res.status(400).json({menssagem: 'A senha é obrigatória'})
    }

    try {
        const usuario = await verificarEmail(email)

        if (usuario.rowCount < 1) {
            return res.status(400).json({menssagem: 'Usuario ou senha inválidos'})
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaValida) {
            return res.status(400).json({menssagem: 'Usuario ou senha inválidos'})
        }

        const token = jwt.sign({id: usuario.rows[0].id}, senhaJWT, {expiresIn: '12h'})

        const { senha: _, ...usuarioLogado} = usuario.rows[0]

        return res.json({
            usuario: usuarioLogado,
            token
        })
    } catch (erro) {
        console.log(erro)
        return res.status(500).json({menssagem: 'Erro interno no servidor'})
    }
}

const detalharUsuarioLogado = async (req, res) => {
    try {
        const { senha: _, ...usuarioLogado} = req.usuario

        return res.json(usuarioLogado)
    } catch (erro) {
        return res.status(500).json({menssagem: 'Erro interno no servidor'})
    }
}

const atualizarUsuarioLogado = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({menssagem: 'O nome é obrigatório'})
    }

    if (!email) {
        return res.status(400).json({menssagem: 'O email é obrigatório'})
    }

    if (!senha) {
        return res.status(400).json({menssagem: 'A senha é obrigatória'})
    }

    try {
        const { id } = req.usuario

        const usuario = await existeEmailForaUsuarioLogado(id, email)

        if (usuario.rowCount > 0) {
            return res.status(400).json({menssagem: 'O e-mail informado já está sendo utilizado por outro usuário'})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await atualizarUsuario(id, nome, email, senhaCriptografada)

        return res.status(204).json()
    } catch (erro) {
        return res.status(500).json({menssagem: 'Erro interno no servidor'})
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuarioLogado,
    atualizarUsuarioLogado
}