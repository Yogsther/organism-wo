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

randomIndex = arr => arr[Math.floor(Math.random() * arr.length)];

var locked = false;
var target = { x: 0, y: 0 };
var frame = 0;
var idIcrement = 0;

var bestInSession = {
	turnSpeed: 0,
	speed: 0,
	lifetime: 0,
	turningFrequency: 0,
	name: "..."
};

const TYPES = {
	creature: "creature",
	food: "food",
	water: "water",
	particle: "particle"
};

var world = [];

var worldCreatures = [];

function populateWorld() {
	creaturesMissing = MAX_CREATURES - worldCreatures.length;
	for (let i = 0; i < creaturesMissing; i++) {
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
	worldCreatures = world.filter(obj => obj.type == TYPES.creature);
	for (let i = 0; i < world.length; i++) {
		let obj = world[i];
		obj.update();
		if (!obj.alive) {
			if (locked == obj.id) locked = false;
			world.splice(i, 1);
		}
	}

	populateWorld();

	updateFood(TYPES.food, Food);
	updateFood(TYPES.water, Water);

	if (locked !== false) {
		for (var obj of world) {
			if (obj.id == locked) {
				target.x = obj.x;
				target.y = obj.y;
			}
		}
	}

	frame++;
}

function render() {
	var tileWidth = 16;
	var padding = tileWidth * SCALE * 2;

	drawRect("#111", 0, 0, canvas.width, canvas.height);

	for (let obj of world) obj.draw();

	worldCreatures.sort((a, b) => {
		return b.lifetime - a.lifetime;
	});

	for (var i = 0; i < worldCreatures.length; i++) {
		worldCreatures[i].placement = i;
	}
	drawScoreboard();

	drawRect("rgba(0,0, 0, .5)", 10, 410, 250, 100);
	drawText("Best in session", 20, 440, 20, "white", "Arial", "left");
	if (world[0].lifetime > bestInSession.lifetime) bestInSession = world[0];
	drawText(bestInSession.name, 20, 465, 15, "white", "Arial", "left");
	drawText(bestInSession.lifetime, 250, 465, 15, "white", "Arial", "right");
	drawText(
		`TS: ${bestInSession.turnSpeed}, S: ${bestInSession.speed.toFixed(
			2
		)}, TF: ${bestInSession.turnFrequency}`,
		20,
		485,
		15,
		"white",
		"Arial",
		"left"
	);

	for (let button of clickableElements) {
		button.draw();
	}
}

function draw(
	color,
	x,
	y,
	centered = false,
	opacity = 1,
	boundByCamera = false
) {
	ctx.globalAlpha = opacity;
	ctx.fillStyle = color;

	if (boundByCamera) {
		var lockedView = getLockedView(x, y);
		x = lockedView.x;
		y = lockedView.y;
	}

	if (centered) {
		x -= (TILE_WIDTH * SCALE) / 2;
		y -= (TILE_WIDTH * SCALE) / 2;
	}

	ctx.fillRect(x, y, TILE_WIDTH * SCALE, TILE_WIDTH * SCALE);
}

function drawRect(
	color,
	x,
	y,
	width,
	height,
	centered = false,
	opacity = 1,
	boundByCamera = false
) {
	ctx.globalAlpha = opacity;
	ctx.fillStyle = color;

	if (boundByCamera) {
		var lockedView = getLockedView(x, y);
		x = lockedView.x;
		y = lockedView.y;
	}

	if (centered) {
		x -= (width * SCALE) / 2;
		y -= (height * SCALE) / 2;
	}

	ctx.fillRect(x, y, width * SCALE, height * SCALE);
}

function getLockedView(x, y) {
	if (locked) {
		x = target.x - x + canvas.width / 2;
		y = target.y - y + canvas.height / 2;
	}

	return { x, y };
}

function drawCircle(color, x, y, radius, boundByCamera = false) {
	var lockedView = getLockedView(x, y);
	x = lockedView.x;
	y = lockedView.y;

	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function drawText(
	text,
	x,
	y,
	size = 8,
	color = "#fff",
	font = "monospace",
	align = "center",
	baseline = "alphabetic",
	boundByCamera = false
) {
	if (boundByCamera) {
		var lockedView = getLockedView(x, y);
		x = lockedView.x;
		y = lockedView.y;
	}

	ctx.fillStyle = color;
	ctx.font = `${size}px ${font}`;
	ctx.textAlign = align;
	ctx.textBaseline = baseline;
	ctx.fillText(text, x, y);
}
