class WorldObject {
	constructor(type, x, y, color = "white") {
		this.x = x;
		this.y = y;
		this.color = color;
		this.type = type;
		this.alive = true;
		this.life = 0;
	}

	update() {}

	die() {
		this.alive = false;
	}
	draw() {
		draw(this.color, this.x, this.y, false, 1);
	}
}

class Food extends WorldObject {
	constructor(x, y) {
		super(TYPES.food, x, y, "#f00");
	}
}

class Water extends WorldObject {
	constructor(x, y) {
		super(TYPES.water, x, y, "#08f");
	}
}

randomIndex = arr => {
	return arr[Math.floor(Math.random() * arr.length)];
};

class Creature extends WorldObject {
	constructor(x, y) {
		super(TYPES.creature, x, y, "#ff0");
		this.name = `${randomIndex(FIRST_NAMES)} ${randomIndex(LAST_NAMES)}`;
		this.direction = 0;
		this.alive = true;
		this.speed = 1;
		this.target = false;
		this.nextDirection = 0;
		this.turnSpeed = 20;
		this.visionRange = 100;
		this.stats = {
			food: 100,
			water: 100
		};

		this.life = 0;
	}

	update() {
		this.life++;
		this.stats.water -= FOOD_COST_PER_FRAME;
		this.stats.food -= FOOD_COST_PER_FRAME;

		if (this.stats.water <= 0 || this.stats.food <= 0) this.die();

		if (this.target) {
			this.nextDirection =
				(Math.atan2(this.target.y - this.y, this.target.x - this.x) *
					180) /
				Math.PI;
		} else {
			if (frame % 100 == 0) {
				if (Math.random() > 0.1) {
					this.nextDirection = Math.random() * 360;
				}
			}
		}

		if (this.nextDirection != this.direction) {
			if (this.nextDirection > this.direction)
				this.direction += this.turnSpeed;
			if (this.nextDirection < this.direction)
				this.direction -= this.turnSpeed;
		}

		// Movement
		this.x += Math.cos(this.direction / (180 / Math.PI)) * this.speed;
		this.y += Math.sin(this.direction / (180 / Math.PI)) * this.speed;

		if (
			this.x > canvas.width ||
			this.x < 0 ||
			this.y > canvas.height ||
			this.y < 0
		) {
			//this.direction += 180;
			this.x %= canvas.width;
			this.y %= canvas.height;
			if (this.x < 0) this.x = canvas.width;
			if (this.y < 0) this.y = canvas.height;
		}

		var objectsInVision = [];
		for (let i = 0; i < world.length; i++) {
			var obj = world[i];

			if (obj.type == TYPES.food || obj.type == TYPES.water) {
				var distance = Math.sqrt(
					Math.pow(this.x - obj.x, 2) + Math.pow(this.y - obj.y, 2)
				);

				if (distance <= TILE_WIDTH) {
					world.splice(i, 1);

					this.stats[obj.type] += FOOD_POINTS;

					if (this.stats[obj.type] > 100)
						this.stats[obj.type] = FOOD_POINTS;
				}

				if (distance < this.visionRange)
					objectsInVision.push({ distance, obj });
			}
		}

		objectsInVision.sort((a, b) => {
			return a.distance - b.distance;
		});

		objectsInVision.sort((a, b) => {
			if (this.stats.food > this.stats.water) {
				(a.obj.type == TYPES.water - b.obj.type) == TYPES.water;
			} else {
				(a.obj.type == TYPES.food - b.obj.type) == TYPES.food;
			}
		});

		this.target =
			objectsInVision.length > 0 ? objectsInVision[0].obj : false;
	}

	draw() {
		// Draw character

		drawCircle("#ffffff20", this.x, this.y, this.visionRange);
		draw(this.color, this.x, this.y, false, 1);

		//stat bars
		let maxMeter = FOOD_LIMIT / 4;
		let foodMeter = this.stats.food / 4;
		let waterMeter = this.stats.water / 4;

		drawRect(
			"#4a4a4a",
			this.x + TILE_WIDTH / 2 - maxMeter / 2,
			this.y - 15,
			maxMeter,
			10
		);
		drawRect(
			"#0f0",
			this.x + TILE_WIDTH / 2 - foodMeter / 2,
			this.y - 15,
			foodMeter,
			5,
			false,
			1
		);

		//
		drawRect(
			"#08f",
			this.x + TILE_WIDTH / 2 - waterMeter / 2,
			this.y - 10,
			waterMeter,
			5,
			false,
			1
		);

		drawText(this.name, this.x + TILE_WIDTH / 2, this.y - 15, 12);
	}
}
