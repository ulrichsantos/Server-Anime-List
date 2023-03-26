const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const { response } = require('express');
const express = require('express');
const app = express();
const port = 3000;

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
    const filtered = animes.filter((anime) => anime.title.toLowerCase().includes(name.toLowerCase()))
})

app.post('/alert', (request, response) => {
    const { email, anime, dataReleased, name } = request.body;

    console.log(email, anime, dataReleased, name);

    sgMail.setApiKey('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');

    const msg = {
        to: email,
        from: 'ulrich_sk8@hotmail.com',
        subject: `Ola ${name} - Teste Alerta`,
        html: `<p><strong>anime:</strong> ${anime} / <strong>released:</strong> ${dataReleased}</p>`,
    };

    sgMail.send(msg)
        .then(sgData=>{
            console.log("sgData=", sgData);
            response.status(200).send('EMAIL ENVIADO!');
        })
        .catch(errs=>{
            console.log("sgMail errors", errs);
            response.status(400).send('FALHOU :(');
        });
});

app.get('/status', (request, response) => {
    response.status(200).send('Server Listening!');
});
