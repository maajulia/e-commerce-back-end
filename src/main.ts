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


//DELETAR
app.delete("/produtos/:id",async(req,res)=>{
    try{
        const banco = new BancoMysql()
        await banco.criarConexao()
        const result = await banco.excluir(req.params.id)
        await banco.finalizarConexao()
        res.status(200).send("Produto excluido com sucesso id: "+req.params.id)
    }
    catch(e){
        console.log(e)
        res.status(500).send("Erro ao excluir")
    }
    
})


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



app.listen(8000, () => {
    console.log("Iniciei o servidor")
})