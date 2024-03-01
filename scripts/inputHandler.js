class InputHandler {
    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById("canvas1");
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                if (this.game.pause) {
                    this.game.pause = false;
                } else {
                    this.game.pause = true;
                }
            }
        });
        this.canvas.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const mouseX = (e.clientX-rect.left)/rect.width;
            const mouseY =  (e.clientY-rect.top)/rect.height;
            //console.log(mouseX, mouseY);
            if (0.975<mouseX && mouseX<0.993 && mouseY>0.1) {
                const buttonId = Math.floor((mouseY-0.1)/0.039);
                //console.log(`On red ${buttonId}`);
                //console.log(this.game.zoneData.BColors[buttonId]);
                const index = this.game.showBacteria.indexOf(this.game.zoneData.BColors[buttonId][0]);
                if (index >= 0) {
                    this.game.showBacteria.splice(index, 1);
                } else {
                    this.game.showBacteria.push(this.game.zoneData.BColors[buttonId][0]);
                }
            }
        }, false);
    }
}