const { Pool } = require('pg')
const { db } = require('../dados/env')

const pool = new Pool(db)

module.exports = {
    criarUsuario: async (nome, email, senha) => {
        try {
            const query = `
                    insert into usuarios (nome, email, senha)
                    values
                    ($1, $2, $3) returning *
                    `

            const params = [nome, email, senha]

            const usuario = await pool.query(query, params)

            const { senha: _, ...novoUsuario } = usuario.rows[0]

            return novoUsuario
        } catch (erro) {
            return erro
        }
    },

    verificarEmail: async (email) => {
        const query = `select * from usuarios where email = $1`

        const existeEmail = await pool.query(query, [email])

        return existeEmail
    },

    usuarioPorID: async (id) => {
        try {
            const query = `select * from usuarios where id = $1`

            const usuario = await pool.query(query, [id])

            return usuario
        } catch (erro) {
            return erro
        }
    },

    existeEmailForaUsuarioLogado: async (id, email) => {
        try {
            const query = `select * from usuarios where id != $1 and email = $2`

            const existeEmail = await pool.query(query, [id, email])

            return existeEmail
        } catch (erro) {
            return erro
        }
    },

    atualizarUsuario: async (id, nome, email, senha) => {
        try {
            const query = `
            update usuarios
            set
            nome = $1,
            email = $2,
            senha = $3
            where id = $4 returning *`

            const params = [nome, email, senha, id]

            const usuario = await pool.query(query, params)

            const { senha: _, ...usuarioAtualizado } = usuario.rows[0]

            return usuarioAtualizado
        } catch (erro) {
            return erro
        }
    },

    listarCategorias: async () => {
        try {
            const query = `select * from categorias`

            const categorias = await pool.query(query)

            return categorias.rows
        } catch (erro) {
            return erro
        }
    },

    listarTransacoes: async (id) => {
        try {
            const query = `select tra.id, tra.tipo, tra.descricao, tra.valor, tra.data,
            tra.usuario_id, tra.categoria_id, cat.descricao as categoria_nome
            from transacoes tra 
            join categorias cat on tra.categoria_id = cat.id
            where usuario_id = $1`

            const transacoes = await pool.query(query, [id]);

            return transacoes.rows
        } catch (erro) {
            return erro
        }
    },

    buscaIdCategoria: async (categoria_nome) => {
        try {
            const query = `select id from categorias where descricao ilike $1`

            const idCategoria = await pool.query(query, [categoria_nome]);

            return idCategoria
        } catch (erro) {
            return erro
        }
    },
    
    filtroTransacoes: async (id_categoria, id_usuario) => {
        try {
            const query = `select tra.id, tra.tipo, tra.descricao, tra.valor, tra.data,
            tra.usuario_id, tra.categoria_id, cat.descricao as categoria_nome
            from transacoes tra 
            join categorias cat on tra.categoria_id = cat.id
            where usuario_id = $1 and categoria_id = $2`

            const filtrado = await pool.query(query, [id_usuario, id_categoria]);

            return filtrado.rows
        } catch (erro) {
            return erro
        }
    },

    detalharTransacao: async (idUsuario, idTransacao) => {
        try {
            const query = `
            select tra.id, tra.tipo, tra.descricao, tra.valor, tra.data,
            tra.usuario_id, tra.categoria_id, cat.descricao as categoria_nome
            from transacoes tra 
            join categorias cat on tra.categoria_id = cat.id
            where usuario_id = $1 and tra.id = $2;
            `;

            const transacao = await pool.query(query, [idUsuario, idTransacao]);

            return transacao.rows
        } catch (erro) {
            return erro
        }
    },
    buscarCategoriaPorId: async (id_categoria) => {
        try {
            const query = `select * from categorias where id = $1;`

            const categoria = await pool.query(query, [id_categoria]);

            return categoria.rows[0]
        } catch (erro) {
            return erro
        }
    },
    cadastrarTransacao: async (descricao, valor, data, tipo, usuario_id, categoria_id) => {
        try {
            const query = `insert into transacoes
            (descricao, valor, data, tipo, usuario_id, categoria_id)
            values
            ($1, $2, $3, $4,$5, $6) returning *;`

            const transacao = await pool.query(query, [descricao, valor, data, tipo, usuario_id, categoria_id]);

            return transacao.rows
        } catch (erro) {
            return erro
        }
    },
    atualizarTransacao: async (descricao, valor, data, tipo, categoria_id, id_transacao, usuario_id) => {
        try {
            const query = `
            update transacoes
            set descricao = $1, valor = $2, data = $3, tipo = $4, categoria_id = $5
            where id = $6 and usuario_id = $7 returning *;
            `
            const parametros = [descricao, valor, data, tipo, categoria_id, id_transacao, usuario_id];

            const transacao = await pool.query(query, parametros);

            return transacao.rows;
        } catch (erro) {
            return erro
        }
    },
    deletarTransacao: async (id_transacao, id_usuario) => {
        try {
            const query = `delete from transacoes where id = $1 and usuario_id = $2 returning *;`

            const transacao = await pool.query(query, [id_transacao, id_usuario]);

            return transacao.rows;

        } catch (erro) {
            return erro
        }
    },
    obterExtrato: async (id) => {
        try {
            const query = `select tipo, sum(valor) from transacoes where usuario_id = $1 group by tipo;`

            const extrato = await pool.query(query, [id]);

            return extrato.rows;
        } catch (erro) {
            return erro
        }
    }
}