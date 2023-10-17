-- Criação da data base.
create database dindin;

-- Criação ta tabela usuarios.
create table usuarios (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
  );

-- Criação ta tabela categorias.
create table categorias (
  id serial primary key,
  descricao text not null
  );
  
  -- Criação ta tabela transações.
create table transacoes (
  id serial primary key,
  descricao text not null,
  valor integer not null,
  data date not null,
  categoria_id integer references categorias(id),
  usuario_id integer references usuarios(id),
  tipo text not null
  );

-- Categorias que podem ser adicionadas.
insert into categorias
(descricao)
values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');