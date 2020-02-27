const client = require('../lib/client');
run ();

async function run() {

    try { 
        await client.connect();

        await client.query (`
        DROP TABLE IF EXISTS todos;
        DROP TABLE IF EXISTS users;
        `);
    }
    catch (err) {
        console.log(err);
    }

    finally {
        client.end();
    }
} 