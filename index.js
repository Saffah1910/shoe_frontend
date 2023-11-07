import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import pgPromise from 'pg-promise';
import Handlebars from 'handlebars';
import axios from 'axios';
// import 'dotenv/config';

// const connectionString = process.env.DATABASE_URL;
// const pgp = pgPromise({});
// const db = pgp(connectionString);

const app = express();

app.engine(
    'handlebars',
    engine({
        handlebars: Handlebars,
        helpers: {
            json: function (context) {
                return JSON.stringify(context);
            },
        },
    })
);

app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash());

app.get('/', async function (req, res) {

    const api_allShoes = "http://localhost:3014/api/shoes";
    const allShoes = (await axios.get(api_allShoes)).data;
    console.log(allShoes);


    res.render('shop', {
        allShoes
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App started at port', PORT);
});