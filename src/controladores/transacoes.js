const bd = require('../bancodedados/bd');

const transacoes = {
    listarTransacoesUsuario: async function (req, res) {
        try {
            const { id } = req.usuario;
            const { filtro } = req.query;

            if (!filtro) { 
                const listaDeTransacoes = await bd.listarTransacoes(id);
                return res.status(200).json(listaDeTransacoes)
            }

            const listaIdCategoria = [];
            for (const i of filtro) {
                const  array_i = i.trim().split('-');
                const i_formatado = array_i.join(' ');

                const id_categoria = await bd.buscaIdCategoria(i_formatado);

                if (id_categoria.rowCount > 0) {
                    listaIdCategoria.push(id_categoria.rows[0].id);
                }
            }

            const filtroCategorias = []
            for (const i of listaIdCategoria) {
                const categoria = await bd.filtroTransacoes(i, id);

                filtroCategorias.push(...categoria);
            }

            return res.status(200).json(filtroCategorias)
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro no servidor" })
        }
    },
    detalharTransacaoUsuario: async function (req, res) {
        const { id } = req.params;

        try {
            const usuario = req.usuario;

            const transacao = await bd.detalharTransacao(usuario.id, id);

            if (transacao.length < 1) {
                return res.status(404).json({ mensagem: "Transação não encontrada." })
            }

            return res.status(200).json(transacao[0])

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor!" })
        }
    },
    cadastrarTransacaoUsuario: async function (req, res) {
        const { descricao, valor, data, categoria_id, tipo } = req.body;

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: "A propriedade de tipo só aceita os valores: 'entrada' e 'saida' " })
        }

        try {
            const verificarCategoria = await bd.buscarCategoriaPorId(categoria_id);
            if (verificarCategoria.length < 1) {
                return res.status(400).json({ mensagem: "A categoria enviada é invalida" })
            }

            const { id } = req.usuario;
            const dataFormatada = new Date(data);

            const categoria = await bd.buscarCategoriaPorId(categoria_id)

            const cadastroTransacao = await bd.cadastrarTransacao(descricao, valor, dataFormatada, tipo,  id,categoria_id, categoria.descricao);

            return res.status(201).json({...cadastroTransacao[0], categoria_nome: categoria.descricao});
        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor" })
        }
    },
    atualizarTransacaoUsuario: async function (req, res) {
        const { id } = req.params;
        const { descricao, valor, data, categoria_id, tipo } = req.body;

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: "A propriedade de tipo só aceita os valores: 'entrada' e 'saida' " })
        }

        try {
            const usuario = req.usuario;
            const dataFormatada = new Date(data);

            const atualizarTransacao = await bd.atualizarTransacao(descricao, valor, dataFormatada, tipo, categoria_id, id, usuario.id);

            if (atualizarTransacao.length < 1) {
                return res.status(404).json({ mensagem: "Transacao não encontrada!" })
            }

            return res.status(204).json();

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor" })
        }
    },
    deletarTransacaoUsuario: async function (req, res) {
        const { id } = req.params;

        try {
            const usuario = req.usuario

            const deletarTransacao = await bd.deletarTransacao(id, usuario.id);

            if (deletarTransacao.length < 1) {
                return res.status(404).json({ mensagem: "Transacao não encontrada!" })
            }

            return res.status(204).json();
        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor!" })
        }
    },
    obterExtratoUsuario: async function (req, res) {
        try {
            const { id } = req.usuario

            const arrExtrato = await bd.obterExtrato(id);
            let entrada = 0
            let saida = 0

            if (arrExtrato[0]) {
                entrada = arrExtrato[0].sum
            }

            if (arrExtrato[1]) {
                saida = arrExtrato[1].sum
            }

            const objResultado = {
                entrada,
                saida
            }

            return res.status(200).json(objResultado);

        } catch (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: "Erro no servidor!" })
        }
    }
}

module.exports = transacoes;