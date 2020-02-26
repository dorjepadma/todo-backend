require('dotenve').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require('./lib/client');

client.connect();

const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
// ToDos
app.get('/api/todos', async(req, res) => {
    try {
        const result = await client.query(`
        `);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            errors: err.message || err
        });
    }
});

app.post('/api/todos', async(req, res) => {
    const todo = req.body;
   
    try {
        const result = await client.query(`
       
       `,
        []);
        res.json(result.rows[0]);
    }
    catch (err) { 
        console.log(err);
        res.status(500).json({
            errors: err.message || err
        });
    }
});

app.put('/api/todos/:id', async(req, res) => {
    const id = req.params.id;
    const todo = req.body;

    try {
        const result = await client.query(`
           
           `, []);

        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
    
app.delete('/api/todos/:id', async(req, res) => {
        // get the id that was passed in the route:
    
    try {
        const result = await client.query(`
    
            `, [/* pass data */]);
    
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
    
    // Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});