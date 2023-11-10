import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
// import pgPromise from 'pg-promise';
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

    const api_allShoes = "https://shoe-api-jdec.onrender.com/api/shoes";
    const allShoes = (await axios.get(api_allShoes)).data;
    // console.log(allShoes);


  


    res.render('shop', {
        allShoes,
       
    });
});

app.post('/filter', async function (req, res) {
    try {
        const selectedBrand = req.body.brand;
        const selectedSize = req.body.size;
        
        if (selectedBrand === "default" && selectedSize === "default") {
            // Handle case where no brand or size is selected (show all shoes)
            const api_allShoes = "https://shoe-api-jdec.onrender.com/api/shoes";
            const shoesData = (await axios.get(api_allShoes)).data;
        
            res.render('shop', {
                allShoes: shoesData,
            });
        } else if (selectedBrand !== "default" && selectedSize === "default") {
            // Handle case where only a brand is selected (filter by brand)
            const api_brand = `https://shoe-api-jdec.onrender.com/api/shoes/brand/${selectedBrand}`;
            const shoesData = (await axios.get(api_brand)).data;
        
            res.render('shop', {
                allShoes: shoesData,
            });
        } else if (selectedBrand === "default" && selectedSize !== "default") {
            // Handle case where only a size is selected (filter by size)
            const api_size = `https://shoe-api-jdec.onrender.com/api/shoes/size/${selectedSize}`;
            const shoesData = (await axios.get(api_size)).data;
        
            res.render('shop', {
                allShoes: shoesData,
            });
        } else {
            // Handle case where both brand and size are selected (filter by both)
            const api_brand_and_size = `https://shoe-api-jdec.onrender.com/api/shoes/brand/${selectedBrand}/size/${selectedSize}`;
            const shoesData = (await axios.get(api_brand_and_size)).data;
        
            res.render('shop', {
                allShoes: shoesData,
            });
        }



    } catch (error) {
        console.error('Error fetching and filtering shoes:', error);
    }
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
    console.log('App started at port', PORT);
});