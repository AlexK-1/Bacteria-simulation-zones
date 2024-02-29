// canvas setup
async function main() {

const canvas = this.document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1700;
canvas.height = 1000;

let device

const adapter = await navigator.gpu?.requestAdapter();
device = await adapter?.requestDevice();

class Game {
    // главный класс игры
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.input = new InputHandler(this);
        this.pause = 0;
        this.zoneEnergy = new ZoneEnergy(this);
        this.zoneReproduction = new ZoneReproduction(this);
        this.zoneData = new ZoneData(this);
        this.dataZone = 
        this.bacteria = [];
        for (let i = 0; i < NUM_BACTERIA; i++) {
            this.bacteria.push(new Bacteria(this, random(0, 1500), random(this.zoneEnergy.height, this.height-this.zoneReproduction.height), undefined, undefined)); // создание нескольких бактрерий
        }
        this.bacteriaColors = {};
    }

    update(device) {
        // обновление данных
        this.bacteriaColors = {};
        if (!this.pause) {
        
        //this.zoneEnergy.update();
        //this.zoneReproduction.update();
        //this.zoneData.update();
        this.bacteria.forEach((element, index) => {
            element.update(device);
            if (this.checkCollision(this.zoneEnergy, element)) { // получение энергии если в жёлтой зоне
                element.energy += GETTING_ENERGY;
            }
            if (element.energy > element.maxEnergy) element.energy = element.maxEnergy;
            if (this.checkCollision(this.zoneReproduction, element) && element.reprTime > element.reprInterval) {
                if (element.energy > element.reprCost*2) { // создание двух новых бактерий
                    this.bacteria.push(new Bacteria(this, element.x+random(-20, 20), element.y+random(-20, 20), element.net, element.color));
                    this.bacteria.push(new Bacteria(this, element.x+random(-20, 20), element.y+random(-20, 20), element.net, element.color));
                    element.energy -= element.reprCost*2;
                } else if (element.energy > element.reprCost) { // создание одной новой бактерии
                    this.bacteria.push(new Bacteria(this, element.x+random(-20, 20), element.y+random(-20, 20), element.net, element.color));
                    element.energy -= element.reprCost;
                }
                element.reprTime = 0;
            }
            if ((element.age > element.maxAge) ||  (element.energy < 0)) { // удаление мёртвых бактерий
                this.bacteria.splice(index, 1);
            }

            // добавление цвета для видового счётчика
            if (Object.keys(this.bacteriaColors).includes(String(element.color))) {
                this.bacteriaColors[String(element.color)] += 1;
            } else {
                this.bacteriaColors[String(element.color)] = 1;
            }
        });
        } else { // нужно для обновления видового счётчика даже при паузе
            this.bacteria.forEach(element => {
                // добавление цвета для видового счётчика
                if (Object.keys(this.bacteriaColors).includes(String(element.color))) {
                    this.bacteriaColors[String(element.color)] += 1;
                } else {
                    this.bacteriaColors[String(element.color)] = 1;
                }
            });
        }
    }

    draw(context, fps) {
        // рисование игры
        this.zoneEnergy.draw(context);
        this.zoneReproduction.draw(context);
        this.zoneData.draw(context, this.bacteriaColors, this.bacteria.length, fps);
        this.bacteria.forEach(element => {
            element.draw(context);
        });
    }

    checkCollision(rect1, rect2) {
        // проверка столкновений двух прямоугольников
        return (
            rect1.x < rect2.x + rect2.width &&
            rect2.x < rect1.x + rect1.width &&
            rect1.y < rect2.y + rect2.height &&
            rect2.y < rect1.y + rect1.height)
}
}

const game = new Game(canvas.width, canvas.height);


let lastCalledTime;
let fps;
const animate = function() {
    // главный цикл игры
    if(!lastCalledTime) {
        lastCalledTime = performance.now();
        fps = 0;
    }
    
    delta = (performance.now() - lastCalledTime)/1000;
    lastCalledTime = performance.now();
    fps = 1/delta;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx, fps);
    game.update(device);
    requestAnimationFrame(animate);
}

animate();

}

main();