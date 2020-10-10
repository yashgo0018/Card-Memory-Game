# CARD MEMORY GAME

This is a memory based game. The player who takes the least amount of clicks to open all the cards will win. The least possible amount of clicks will be 12.

### Installation
1. Create a virtual Server
2. Install Docker and Docker Compose on the server
3. Clone this github repository on the virtual machine
4. Create a file `.env` inside the main folder
5. Generate a secret key by `openssl rand -hex 32` 
6. Create a variable `SECRET_KEY` in the `.env` file as `SECRET_KEY={}` where `{}` will be replaced by the secret key.
7. CD into the main folder
8. Run `docker-compose build`
9. Run `docker-compose up`
10. Change the hostname in `frontend/pages/index.tsx`