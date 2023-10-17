const { listarCategorias } = require('../bancodedados/bd')

const listagemCategorias = async (req, res) => {
    try {
        const categorias = await listarCategorias()

        return res.json(categorias)
    } catch (erro) {
        return res.status(500).json({menssagem: 'Erro interno no servidor'})
    }
}

module.exports = {
    listagemCategorias
}