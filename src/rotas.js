const express = require('express')

const { login, cadastrarUsuario, detalharUsuarioLogado, atualizarUsuarioLogado } = require('./controladores/usuarios')
const autenticarUsuario = require('./intermediarios/autenticacao')
const { listagemCategorias } = require('./controladores/categorias')
const transacoes = require('./controladores/transacoes')

const rotas = express()

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login)

rotas.use(autenticarUsuario)

rotas.get('/usuario', detalharUsuarioLogado)
rotas.put('/usuario', atualizarUsuarioLogado)

rotas.get('/categoria', listagemCategorias)

rotas.get('/transacao', transacoes.listarTransacoesUsuario)
rotas.get('/transacao/extrato', transacoes.obterExtratoUsuario)
rotas.get('/transacao/:id', transacoes.detalharTransacaoUsuario)
rotas.post('/transacao', transacoes.cadastrarTransacaoUsuario)
rotas.put('/transacao/:id', transacoes.atualizarTransacaoUsuario)
rotas.delete('/transacao/:id', transacoes.deletarTransacaoUsuario)


module.exports = rotas