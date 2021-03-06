require('dotenv').config();

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
app.use(express.urlencoded({ extended: true }));

const createAuthRoutes = require('././lib/auth/create-auth-routes');

const authRoutes = createAuthRoutes({
    selectUser(email) {
        return client.query(`
        SELECT id, email, hash
        FROM users
        WHERE email = $1;
        `,
        [email]
        ).then(result => result.row[0]);
    },
    insertUser(user, hash) {
        return client.query(`INSERT into users (email, hash)
        VALUES ($1, $2)
        RETURNING id, email;
        `,
        [user.email, hash]
        ).then(result => result.rows[0]);
    }
});

app.use('/api/auth', authRoutes);

const ensureAuth = require('./lib/auth/ensure-auth');

app.use('/api', ensureAuth);

app.get('/api/todos', async(req, res) => {

    try {
        const result = await client.query(`
            select * from todos;
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
    try {
        // console.log('|||||', req.body);

        // const query = `insert into todos (task, complete) values ('${req.body.task}', false) returning *;
        // `;
        const result = await client.query(`
            insert into todos (task, complete, user_id) values ($1, false, $2)
            returning *;
        `,
        [req.body.task, req.userId]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

    // const todo = req.body;
app.put('/api/todos/:id', async(req, res) => {
    try {
        const result = await client.query(`
        update todos set complete = ${req.body.complete}
        where id = $(req.params.id)
        returning *;
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
app.delete('/api/todos/:id', async(req, res) => {
        // get the id that was passed in the route:
    
    try {
        const result = await client.query(`
            delete from todos where id=${req.params.id} returning *;
            `,); 
    
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