const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authorize = require('../middleware/authorize');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authorize);

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
        res.json({ msg: 'Board deleted', board: deletedBoard });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete board' });
    }
});

router.get('/:id/cards', async (req, res) => {
    try {
        const boardId = parseInt(req.params.id, 10);

        if (isNaN(boardId)) {
            return res.status(400).json({ error: 'Invalid board ID' });
        }

        const board = await prisma.boards.findUnique({
            where: { id: boardId }
        });

        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        const cards = await prisma.cards.findMany({
            where: { boardId: boardId },
            orderBy: [
                { createdAt: 'asc' }
            ]
        });

        res.json(cards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch cards for board' });
    }
});

router.post('/:id/cards', async (req, res) => {
    try {
        const boardId = parseInt(req.params.id, 10);

        if (isNaN(boardId)) {
            return res.status(400).json({ error: 'Invalid board ID' });
        }

        const board = await prisma.boards.findUnique({
            where: { id: boardId }
        });

        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        const { title, content, positionX, positionY } = req.body;

        const newCard = await prisma.cards.create({
            data: {
                title: title || 'Untitled Card',
                content: content || '',
                boardId: boardId,
                positionX: positionX || 0,
                positionY: positionY || 0
            }
        });

        res.status(201).json(newCard);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create card for board' });
    }
});

router.put('/cards/:cardId', async (req, res) => {
    try {
        const cardId = parseInt(req.params.cardId, 10);
        const { title, content, positionX, positionY } = req.body;
        if (isNaN(cardId)) {
            return res.status(400).json({ error: 'Invalid card ID' });
        }
        const card = await prisma.cards.findUnique({
            where: { id: cardId }
        });
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        const updatedCard = await prisma.cards.update({
            where: { id: cardId },
            data: {
                title: title !== undefined ? title : card.title,
                content: content !== undefined ? content : card.content,
                positionX: positionX !== undefined ? positionX : card.positionX,
                positionY: positionY !== undefined ? positionY : card.positionY
            }
        });
        res.json(updatedCard);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

router.delete('/cards/:cardId', async (req, res) => {
    try {
        const cardId = parseInt(req.params.cardId, 10);

        if (isNaN(cardId)) {
            return res.status(400).json({ error: 'Invalid card ID' });
        }

        const card = await prisma.cards.findUnique({
            where: { id: cardId }
        });

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        await prisma.cards.delete({
            where: { id: cardId }
        });

        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

module.exports = router;