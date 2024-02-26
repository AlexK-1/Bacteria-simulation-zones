class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                if (this.game.pause) {
                    this.game.pause = false;
                } else {
                    this.game.pause = true;
                }
            }
        });
        window.addEventListener('keyup', (e) => {
            
        });
    }
}