import express from 'express';

const app = express();

app.use(express.static('build'));

app.listen(process.env.PORT ?? 2560);