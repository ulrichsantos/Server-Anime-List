const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const { response } = require('express');
const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

app.get('/animes', (request, response) => {
    const animes = require("./anime.json")
    response.status(200).send(animes)
})

app.get('/animes/:name', (request, response) => {
    const name = request.params.name
    const animes = require("./anime.json")
    console.log("animes", animes)
    const filtered = animes.filter((anime) => anime.title.toLowerCase().includes(name.toLowerCase()))
    console.log("filtered", filtered)
    response.status(200).send(filtered)
})

app.post('/alert', (request, response) => {
    const { email, anime, dataReleased, name } = request.body;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: email,
        from: 'ulrich_isantos@hotmail.com',
        subject: `Olá ${name} - Não esqueça de ver esse anime!`,
        html: `<p><strong>anime:</strong>Hoje lança um episódio quentinho de ${anime} / <strong>Data:</strong> ${dataReleased}</p>`,
    };

    sgMail.send(msg)
        .then(sgData=>{
            response.status(200).send('EMAIL ENVIADO!');
        })
        .catch(errs=>{
            response.status(400).send('FALHOU :(');
        });
});

app.get('/status', (request, response) => {
    response.status(200).send('Server Listening!');
});
