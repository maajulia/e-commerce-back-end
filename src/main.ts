import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())


app.get("/roupas", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "aiven",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 21978
        })
        const [result, fields] = await connection.query("SELECT * from roupas")
        await connection.end()
        res.send(result)
    } catch (e) {
        res.status(500).send("Server ERROR")
    }
})
app.post("/roupas", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "aiven",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 21978
        })
        const {id,nome,descricao,preco,imagem,cor,composicao,tamanhos,estoque} = req.body
        const [result, fields] = 
                    await connection.query("INSERT INTO roupas VALUES (?,?,?,?,?,?,?,?,?)",
                            [id,nome,descricao,preco,imagem,cor,composicao,tamanhos,estoque])
        await connection.end()
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send("Server ERROR")
    }
})

// deletar
app.delete("/produtos/:id", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "aiven",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 21978
        });

        // Especificando o tipo do resultado
        const [result]: any = await connection.query(
            "DELETE FROM produtos WHERE id = ?",
            [req.params.id]
        );

        await connection.end();

        if (result.affectedRows > 0) {
            res.status(200).send("Produto excluído com sucesso id: " + req.params.id);
        } else {
            res.status(404).send("Produto não encontrado id: " + req.params.id);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro no servidor");
    }
});

//alterar
app.put("/produtos/:id", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "aiven",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 21978
        });

        const { nome, descricao, preco, imagem } = req.body;
        const produto = { nome, descricao, preco, imagem };

        const [result] = await connection.query(
            "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem = ? WHERE id = ?",
            [produto.nome, produto.descricao, produto.preco, produto.imagem, req.params.id]
        );

        await connection.end();
        res.status(200).send("Produto alterado com sucesso id: " + req.params.id);
    } catch (e) {
        console.log(e);
        res.status(500).send("Erro no servidor");
    }
});

app.post("/cadastro", async (req, res) => {
    try {

        const { nome, telefone, endereco, cpf }: { nome: string, telefone: string, endereco: string, cpf: string } = req.body;
        
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "aiven",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 21978
        })
      // Insere os dados na tabela 'usuarios'
      const [result] = await connection.query(
        "INSERT INTO usuarios (nome, telefone, endereco, cpf) VALUES (?, ?, ?, ?)",
        [nome, telefone, endereco, cpf]
    );

    await connection.end();
    res.status(201).send("Usuário cadastrado com sucesso!");
} catch (e) {
    console.log(e);
    res.status(500).send("Erro no servidor ao cadastrar usuário.");
}
});


app.listen(8000, () => {
    console.log("Iniciei o servidor")
})