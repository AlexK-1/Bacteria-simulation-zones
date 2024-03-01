const config = {
    activation: 'tanh',
    inputSize: 4,
    outputSize: 2,
    hiddenLayers: [5, 5]
}

const random = function(a, b) {
    return Math.floor(Math.random() * (b-a)) + a
}

class Bacteria {
    // класс бактерии
    constructor(game, x, y, net, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.speed = BACTERIA_SPEED;
        //this.maxAge = 2400 + Math.floor(Math.random()*200);
        this.maxAge = MAX_AGE;
        this.maxEnergy = MAX_ENERGY;
        this.age = 0;
        this.energy = ENERGY_BIRTH;
        this.energyUsage = ENERGY_USAGE;
        this.reprInterval = REPR_INTERVAL;
        this.reprTime = -REPR_START;
        this.reprCost = REPR_COST;
        this.speedX = 0;
        this.speedY = 0;

        this.color = undefined;
        if (typeof color === "undefined") {
            this.color = random(0, 359);
        } else {
            this.color = color;
        }

        this.net = undefined;
        if (typeof net === "undefined") {
            this.net = new Network([ // структура нейросети бактерий
                new Layer(4, 5, "relu"), // кол-во входов, кол-во выходов, ф. активации
                new Layer(5, 5, "sigmoid"),
                new Layer(5, 2, "tanh"),
            ]);
        } else {
            this.net = new Network(structuredClone(net).layers.map(element => new Layer(element.inputSize-1, element.numberNeurons, element.activation, element.bias, element.weights)));
            
            if (randomFloat(0, 0.99) < MUT_RATE) {
                this.net.mutate(MUT_SIZE);
                const color_change = random(-40, 40);
                //console.log(`Bacteria has mutated. Parent color: ${this.color}, new color: ${this.color+color_change}`);
                this.color += color_change;
            }
        }
        if (this.x > this.game.width-this.game.zoneData.width-this.width) this.x = this.game.width-this.game.zoneData.width-this.width;
        if (this.x < 0) this.x = 0;
        if (this.y > this.game.height-this.height) this.y = this.game.height-this.height;
        if (this.y < 0) this.y = 0;
    }

    update() {
        //[this.speedX, this.speedY] = this.net.run([this.x/this.game.width-this.game.zoneData.width, this.y/this.game.height, this.energy/this.maxEnergy, this.age/this.maxAge]);
        [this.speedX, this.speedY] = this.net.run([this.x, this.y, this.energy, this.age]); // запуск нейросети
        this.x += (this.speedX)*this.speed;
        this.y += (this.speedY)*this.speed;
        if (this.x > this.game.width-this.game.zoneData.width-this.width) this.x = this.game.width-this.game.zoneData.width-this.width;
        if (this.x < 0) this.x = 0;
        if (this.y > this.game.height-this.height) this.y = this.game.height-this.height;
        if (this.y < 0) this.y = 0;

        this.energy -= this.energyUsage;
        this.age++;
        this.reprTime += 1;
    }

    draw(context) {
        // рисование бактерии
        context.fillStyle = `HSL(${this.color},100%,${this.energy*0.05}%)`;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}