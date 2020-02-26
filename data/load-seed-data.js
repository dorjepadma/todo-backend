const client = require('../lib/client');
const todos = require('./todos');

run();

async function run () {

try {
    await client.connect();

    await Promise.all(
        todos.map(todo => {
            return client.query(`
            INSERT INTO todos (taks, complete)
            VALUES ($1, $2);
            `,
            [todo.taks, todo.complete]);
        })
    );
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}