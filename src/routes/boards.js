const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const boards = await prisma.boards.findMany();
        res.json(boards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch boards' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const boardId = parseInt(req.params.id, 10);
        
        if (isNaN(boardId)) {
            return res.status(400).json({ error: 'Invalid board ID' });
        }
        
        const board = await prisma.boards.findUnique({
            where: { id: boardId },
        });
        
        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }
        
        res.json(board);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch board' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newBoard = await prisma.boards.create({
            data: {
                name: req.body.name || 'Untitled Board',
                description: req.body.description || ''
            }
        });
        res.status(201).json(newBoard);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create board' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const boardId = parseInt(req.params.id, 10);
        if (isNaN(boardId)) {
            return res.status(400).json({ error: 'Invalid board ID' });
        }
        const deletedBoard = await prisma.boards.delete({
            where: { id: boardId },
        });
        res.json({msg: 'Board deleted', board: deletedBoard});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete board' });
    }
});

module.exports = router;