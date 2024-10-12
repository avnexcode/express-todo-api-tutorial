import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import Logging from './helpers/Logging.js';
import cors from 'cors'

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors())

const router = express.Router();

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});

const errorHandler = async (error, req, res, next) => {
    console.log(`Middleware running - CROT`);
    if (error.stack) {
        Logging.error(error.stack);
    }
    res.status(500).send('Something broke!');
    next();
};

router.get('/', async (req, res, next) => {

    try {

        const sql = `SELECT * FROM todos`;

        const [data] = await db.execute(sql);

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success retrieved all todos data',
            data,
        });

    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {

    const { id: todoID } = req.params;

    try {

        const sql = `SELECT * FROM todos WHERE id = ?`;

        const values = [todoID];

        const [data] = await db.execute(sql, values);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success retrieved todo detail',
            data,
        });

    } catch (error) {
        return next(error);
    }
});

router.post('/', async (req, res, next) => {
    const { text } = req.body;

    try {

        const sql = `INSERT INTO todos (text) VALUES (?)`;

        const values = [text];

        const [data] = await db.execute(sql, values);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success created new todo',
            data,
        });

    } catch (error) {
        return next(error);
    }
});

router.put('/:id', async (req, res, next) => {

    const { id: todoID } = req.params;
    const { text, status } = req.body;

    if (!text && status) {
        return res.status(404).json({
            status: false,
            statusCode: 404,
            message: 'Some fields are kissing',
        });
    }

    const newTodo = { text, status };

    try {
        const sql = `UPDATE todos SET text = ?, status = ? WHERE id = ?`;

        const values = [newTodo.text, newTodo.status, todoID];

        const [data] = await db.execute(sql, values);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success updated new todo',
            data,
        });

    } catch (error) {
        return next(error);
    }
});

router.patch('/:id', async (req, res, next) => {

    const { id: todoID } = req.params;

    const { text, status } = req.body;

    if (text === '' || (status !== undefined && typeof status !== 'boolean')) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Invalid input: text cannot be empty and status must be a boolean'
        });
    }

    try {

        const updates = [];
        const values = [];

        if (text !== undefined) {
            updates.push('text = ?');
            values.push(text);
        }

        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'No valid fields to update'
            });
        }

        values.push(todoID);

        const sql = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;

        const [data] = await db.execute(sql, values);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success updated todo data',
            data
        });

    } catch (error) {
        return next(error);
    }
});


router.delete('/:id', async (req, res, next) => {

    const { id: todoID } = req.params;

    try {

        const sql = `DELETE FROM todos WHERE id = ?`;

        const values = [todoID];

        const [data] = await db.execute(sql, values);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success deleted todo data',
            data
        });

    } catch (error) {
        return next(error);
    }
})

app.use('/api/v1/todos', router);
router.use(errorHandler);

export default app;