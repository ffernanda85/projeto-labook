# Labook

O Labook é uma rede social com o objetivo de promover a conexão e interação entre pessoas. Quem se cadastrar no aplicativo poderá criar e curtir publicações.
<hr><br>

## ✏️ Índice:

- <a href="#layout">Layout</a>
- <a href="#requisicoes">Requisições</a>
- <a href="#exemplos">Exemplos de Requisições</a>
- <a href="#documentacao-post">Documentação no Postman</a>
- <a href="#tecnologias">Tecnologias Utilizadas</a>
- <a href="#como-rodar">Como Rodar o Projeto</a>
- <a href="#pessoas-autoras">Pessoas Autoras</a>

<br>

<span id="layout"></span>

## 1. 📐 Layout

### 1.1 Estrutura das Tabelas
<br>

![Tabelas](https://user-images.githubusercontent.com/29845719/216036534-2b3dfb48-7782-411a-bffd-36245b78594e.png)

## 1.3 Endpoints Implementados
<br>

- [x] Signup
- [x] Login
- [x] Create Post
- [x] Get Posts
- [x] Edit Post
- [x] Delete Post
- [x] Like / Dislike

<br>

<span id="requisicoes"></span>

## 2. 📲 Requisições


### 2.1 - Requisições de Usuários
- /users 

### 2.2 - Requisições de Posts
- /posts

<br>
<span id="exemplos"></span>

## 3. Exemplos de Requisições


### 3.1 - Requisições de Usuários

### Signup: 
* Endpoint público utilizado para cadastro. Devolve um token JWT.

```json
// request POST /users/signup
// body JSON
{
  "name": "Beltrana",
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 201 CREATED
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwM2RhN2E2LWQ1YjEtNDlhMy1iM2E0LTQ4YTU1ZTA0YTdhZSIsIm5hbWUiOiJNYXJpZXRhIE1hcmlhIiwicm9sZSI6Ik5PUk1BTCIsImlhdCI6MTY5MjkxNDY2NSwiZXhwIjoxNjkzNzc4NjY1fQ.aHY8l_AqnvAuSj2IzMn3ubfAC5b3TQIdojHL7QMqlU0"
}
```
### Login: 
* Endpoint público utilizado para login. Devolve um token JWT.
```json
// request POST /users/login
// body JSON
{
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwM2RhN2E2LWQ1YjEtNDlhMy1iM2E0LTQ4YTU1ZTA0YTdhZSIsIm5hbWUiOiJNYXJpZXRhIE1hcmlhIiwicm9sZSI6Ik5PUk1BTCIsImlhdCI6MTY5MjkxNDY2NSwiZXhwIjoxNjkzNzc4NjY1fQ.aHY8l_AqnvAuSj2IzMn3ubfAC5b3TQIdojHL7QMqlU0"
}
```
<br>

### 3.2 - Requisições de Posts

### Create Post: 

* Executa a criação de novos posts. Endpoint protegido, requer um token jwt para acessá-lo.
```json
// request POST /posts
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Partiu happy hour!"
}

// response
// status 201 CREATED
```

### Get Posts: 
* Endpoint protegido, requer um token JWT para acessá-lo.
```json
// request GET /posts
// headers.authorization = "token jwt"

// response
// status 200 OK
[
    {
        "id": "uma uuid v4",
        "content": "Hoje vou estudar POO!",
        "likes": 2,
        "dislikes": 1,
        "createdAt": "2023-01-20T12:11:47:000Z",
        "updatedAt": "2023-01-20T12:11:47:000Z",
        "creator": {
            "id": "uma uuid v4",
            "name": "Fulano"
        }
    },
    {
        "id": "uma uuid v4",
        "content": "kkkkkkkkkrying",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-01-20T15:41:12:000Z",
        "updatedAt": "2023-01-20T15:49:55:000Z",
        "creator": {
            "id": "uma uuid v4",
            "name": "Ciclana"
        }
    }
]
```

### Edit Post: 
* Endpoint protegido, requer um token jwt para acessá-lo.
Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.
```json
// request PUT /posts/:id
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Partiu happy hour lá no point de sempre!"
}

// response
// status 200 OK
```

### Delete Post: 
* Endpoint protegido, requer um token jwt para acessá-lo.
Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.
```json
// request DELETE /posts/:id
// headers.authorization = "token jwt"

// response
// status 200 OK
```

### Like or Dislike Post:
* Endpoint protegido, requer um token jwt para acessá-lo. 
* Quem criou o post não pode dar like ou dislike no mesmo. 
* Caso dê um like em um post que já tenha dado like, o like é desfeito. 
* Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito. 
* Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.
* Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.

### Like (funcionalidade 1)
```json
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": true
}

// response
// status 200 OK
```

### Dislike (funcionalidade 2)
```json
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": false
}

// response
// status 200 OK
```
<br>
<span id="documentacao-post"></span>

## 4. 💾 Documentação do Postman

link: https://documenter.getpostman.com/view/26594531/2s9Y5WxPBo

<br>
<span id="tecnologias"></span>

## 5. 🛠 Tecnologias e Ferramentas Utilizadas

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [SQL](https://learn.microsoft.com/pt-br/sql/?view=sql-server-ver16)
- [SQLite](https://www.sqlite.org/docs.html)
- [Knex.js](https://knexjs.org/guide/)
- [POO](https://labenu.notion.site/Paradigmas-de-programa-o-77a9b3b7072d48b2ad75fc359afde658)
- [Arquitetura em Camadas](https://labenu.notion.site/Introdu-o-arquitetura-f838b79564404d79a960e9cacc99556e)
- [Geração de UUID](https://labenu.notion.site/Identificador-nico-Universal-UUID-52dd33d6edc942ceb8b61870195c398f)
- [Geração de Hashes](https://labenu.notion.site/Criptografia-Hash-de-senhas-com-Bcrypt-455db6cae99641fb842a17c0901873c7)
- [Autenticação e Autorização](https://labenu.notion.site/Endpoints-protegidos-via-token-c48fc57b62fa4e60bc74c47a54becb9f)
- [Roteamento](https://labenu.notion.site/Middlewares-no-Express-564111c138384f24a142368f2cd7a39a)
- [Postman](https://www.postman.com/)

<br>
<span id="como-rodar"></span>

## 6. 🎥 Como Rodar o Projeto

### 6.1 - Ferramentas Necessárias
<p>Para poder rodar esse projeto na sua máquina, você precisa ter as seguintes ferramentas instaladas:</p>

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/)
<br>

### 6.2 - Clonando Repositório
```bash
# Clone este repositório
$ git clone <https://github.com/ffernanda85/projeto-labook.git>
```
### 6.3 - Instalando as Dependências
```bash
# Instale as dependências
$ npm install
```

### 6.4 - Executando a Aplicação
```bash
$ npm run dev

# O servidor iniciará na porta: 3003, você poderá acessar a aplicação em: <http://localhost:3003>
```
<br>
<span id="pessoas-autoras"></span>

## 👩🏽‍💻Pessoas Autoras:
<br>

<img style='width:130px'  src='https://avatars.githubusercontent.com/u/114631584?v=4' alt='pessoa desenvolvedora'>
<br/>

<h4>Flávia Santos</h4>
<br/>

Linkedin: https://www.linkedin.com/in/flavia-santos-dev/