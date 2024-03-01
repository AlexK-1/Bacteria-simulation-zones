class Zone {
    // основной класс зоны
    constructor(game) {
        this.game = game;
        this.width = game.width-300;
        this.x = 50;
    }

    update() {

    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class ZoneEnergy extends Zone {
    // зона получения энергии
    constructor(game) {
        super(game);
        this.y = 0;
        this.height = YELLOW_ZONE_HEIGHT;
        this.x = YELLOW_ZONE_X;
        this.width = YELLOW_ZONE_WIDTH;
        this.color = "#D3DD4B";
    }
}

class ZoneReproduction extends Zone {
    // зона размножение бактерий
    constructor(game) {
        super(game);
        this.height = GREEN_ZONE_HEIGHT;
        this.y = this.game.height - GREEN_ZONE_HEIGHT;
        this.x = GREEN_ZONE_X;
        this.width = GREEN_ZONE_WIDTH;
        this.color = "#46C16F";
    }
}

class ZoneData extends Zone {
    // зона для отображения данных о видах бактерий
    constructor(game) {
        super(game);
        this.height = this.game.height;
        this.width = 200;
        this.y = 0;
        this.x = this.game.width - this.width;
        this.color = "#FFF";
        this.borderWidth = 5;
        this.BColors = [];
        this.BColors2 = [];
    }

    draw(context, bacteriaColors, bacteriaCount, fps) {
        // отрисовка белой зоны
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = "black";
        context.fillRect(this.x, this.y, this.borderWidth, this.height);

        // отрисовка количества бактерий и FPS
        context.fillStyle = "black";
        context.font = "30px Helvetica";
        context.fillText("FPS: " + Math.round(fps), this.x+this.borderWidth+10, 35);
        context.fillText("Total: " + bacteriaCount, this.x+this.borderWidth+10, 72);

        // отображение бактерий разного вида
        let colors = Object.entries(bacteriaColors).sort((a, b) => b[1] - a[1]).slice(0, 24); // сортировка списка цветов в порядке убывания
        this.BColors = colors;
        this.BColors2 = colors.map(element => element[0]);

        
        let y = 115;
        context.font = "20px Helvetica";
        for (let bColor of colors) {
            context.fillStyle = "black";
            context.fillText(bColor[1], this.x+this.borderWidth+52, y);

            context.fillStyle = `HSL(${bColor[0]},100%,50%)`;
            context.fillRect(this.x+this.borderWidth+15, y-19, 25, 25);

            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "red";
            context.arc(this.game.width-20, y-6, 12, 0, Math.PI*2, false);
            context.stroke();

            if (this.game.showBacteria.includes(bColor[0])) {
                context.beginPath();
                context.fillStyle = "red";
                context.arc(this.game.width-20, y-6, 8, 0, Math.PI*2, false);
                context.fill();
            }
            y += 39.5;
        }
    }
}