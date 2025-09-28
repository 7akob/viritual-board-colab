# viritual-board-colab
API for virtual board collaboration. Course project for Arcada UAS.

## Endpoints:
- GET /boards = Returns all boards
- GET /boards/:id = Returns a board by id
- POST /boards = Post a new board with name and description (description not implemented in our frontend)
- DELETE /boards/:id = Delete board by id
- GET /boards/:id/cards = Get card by board id
- POST /boards/:id/cards = Post a card to board id
- PUT /boards/cards/:cardId = Edit a card by card id
- DELETE /boards/cards/:cardId = Delete card by card id


Done by:
Jakob and Morris