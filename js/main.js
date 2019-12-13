var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var SCALE = 1;
const TILE_WIDTH = 5;
const FOOD_COST_PER_FRAME = 0.5;
const FOOD_POINTS = 100;
const FOOD_LIMIT = 100;
const MAX_CREATURES = 15;

window.onresize = resizeCanvas;
window.onload = () => {
	resizeCanvas();
	populateWorld();
	loop();
};

var frame = 0;

var bestInSession = {
	turnSpeed: 0,
	speed: 0,
	life: 0,
	turningFrequency: 0,
	name: "..."
};

const TYPES = {
	creature: "creature",
	food: "food",
	water: "water",
	particle: "particle"
};

var world = [new Creature(canvas.width / 2, canvas.height / 2)];

function populateWorld() {
	while (
		world.filter(obj => obj.type == TYPES.creature).length < MAX_CREATURES
	) {
		world.push(
			new Creature(
				Math.random() * canvas.width,
				Math.random() * canvas.height
			)
		);
	}
}

function resizeCanvas() {
	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;

	ctx.imageSmoothingEnabled = false;
}

function loop() {
	logic();

	render();
	requestAnimationFrame(loop);
}

function updateFood(type, obj) {
	let foodCount = world.filter(item => item.type == type).length;
	if (foodCount < FOOD_LIMIT) {
		world.push(
			new obj(
				Math.floor(Math.random() * canvas.width),
				Math.floor(Math.random() * canvas.height)
			)
		);
	}
}

function logic() {
	for (let i = 0; i < world.length; i++) {
		world[i].update();

		if (world[i]) {
			if (!world[i].alive) {
				world.splice(i, 1);
			}
		}
	}
	populateWorld();

	updateFood(TYPES.food, Food);
	updateFood(TYPES.water, Water);
	frame++;
}

function render() {
	var tileWidth = 16;
	var padding = tileWidth * SCALE * 2;

	ctx.fillStyle = "#111";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let obj of world) obj.draw();

	world.sort((a, b) => {
		return b.life - a.life;
	});

	for (var i = 0; i < world.length; i++) {
		if (world[i].type == TYPES.creature) {
			world[i].placement = i;
		}
	}

	drawRect("rgba(0,0, 0, .5)", 10, 10, 250, 390);

	ctx.textAlign = "left";

	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Scoreboard", 20, 50);
	ctx.font = "15px Arial";
	var spacing = 32;
	for (var i = 0; i < 10; i++) {
		if (world[i] && world[i].type == TYPES.creature) {
			ctx.fillStyle = "#a3a3a3";
			ctx.textAlign = "left";
			if (i == 0) ctx.fillStyle = "gold";
			if (i == 1) ctx.fillStyle = "silver";
			if (i == 2) ctx.fillStyle = "darkorange";
			ctx.fillText(`${i + 1}. ${world[i].name}`, 20, 80 + i * spacing);
			ctx.textAlign = "right";
			ctx.fillText(`${world[i].life}`, 250, 80 + i * spacing);

			//stat bars
			let foodMeter = world[i].stats.food * 2.2;
			let waterMeter = world[i].stats.water * 2.2;
			drawRect("#f40", 30, 85 + i * spacing, foodMeter, 5, false, 1);
			drawRect("#08f", 30, 90 + i * spacing, waterMeter, 5, false, 1);
		}
	}

	drawRect("rgba(0,0, 0, .5)", 10, 410, 250, 100);
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.font = "20px Arial";
	ctx.fillText("Best in session", 20, 440);
	ctx.font = "15px arial";
	if (world[0].life > bestInSession.life) {
		bestInSession.name = world[0].name;
		bestInSession.turnSpeed = world[0].turnSpeed.toFixed(2);
		bestInSession.life = world[0].life;
		bestInSession.speed = world[0].speed.toFixed(2);
		bestInSession.turningFrequency = world[0].turnFrequency;
	}

	ctx.fillText(bestInSession.name + " (" + bestInSession.life + ")", 20, 465);
	ctx.fillText(
		`TS: ${bestInSession.turnSpeed}, S: ${bestInSession.speed}, TF: ${bestInSession.turningFrequency}`,
		20,
		485
	);
}

function draw(color, x, y, centered = false, opacity = 1) {
	ctx.globalAlpha = opacity;
	ctx.fillStyle = color;
	if (centered) {
		x -= (TILE_WIDTH * SCALE) / 2;
		y -= (TILE_WIDTH * SCALE) / 2;
	}
	ctx.fillRect(x, y, TILE_WIDTH * SCALE, TILE_WIDTH * SCALE);
}

function drawRect(color, x, y, width, height, centered = false, opacity = 1) {
	ctx.globalAlpha = opacity;
	ctx.fillStyle = color;
	if (centered) {
		x -= (width * SCALE) / 2;
		y -= (height * SCALE) / 2;
	}
	ctx.fillRect(x, y, width * SCALE, height * SCALE);
}

function drawCircle(color, x, y, radius) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function drawText(text, x, y, size = 8, color = "#fff") {
	ctx.fillStyle = color;
	ctx.font = `${size}px monospace`;
	ctx.textAlign = "center";
	ctx.fillText(text, x, y);
}
