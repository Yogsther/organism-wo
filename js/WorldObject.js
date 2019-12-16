class WorldObject {
	constructor(type, x, y, color = "white") {
		this.x = x;
		this.y = y;

		this.id = idIcrement++;

		this.alive = true;
		this.lifetime = 0;
		this.color = color;
		this.type = type;
	}

	update() {}

	die() {
		this.alive = false;
	}
	draw() {
		draw(this.color, this.x, this.y, false, 1);
	}
}

class Eatable extends WorldObject {
	constructor(type, x, y, color) {
		super(type, x, y, color);
	}

	draw() {
		draw(this.color, this.x, this.y, false, 1, true);
	}
}
class Food extends Eatable {
	constructor(x, y) {
		super(TYPES.food, x, y, "#f40");
	}
}

class Water extends Eatable {
	constructor(x, y) {
		super(TYPES.water, x, y, "#08f");
	}
}

class Creature extends WorldObject {
	constructor(x, y) {
		super(TYPES.creature, x, y, "#ff0");
		this.name = `${randomIndex(FIRST_NAMES)} ${randomIndex(LAST_NAMES)}`;
		this.direction = 0;
		this.alive = true;
		this.speed = Math.random() * 5;
		this.target = false;
		this.nextDirection = 0;
		this.turnSpeed = Math.round(Math.random() * 50);
		this.turnFrequency = Math.floor(Math.random() * 50);
		this.placement = 0;
		this.visionRange = 100;
		this.stats = {
			food: 100,
			water: 100
		};

		this.max = {
			food: 100,
			water: 100
		};

		this.lifetime = 0;
	}

	update() {
		this.lifetime++;
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
				if (Math.random() < this.turnSpeed / 100) {
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

		var objectsInVision = this.getObjectsInVision();

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

	getObjectsInVision() {
		let objInV = [];
		for (let i = 0; i < world.length; i++) {
			var obj = world[i];

			if (obj.type == TYPES.food || obj.type == TYPES.water) {
				var distance = Math.sqrt(
					Math.pow(this.x - obj.x, 2) + Math.pow(this.y - obj.y, 2)
				);

				if (distance <= TILE_WIDTH) {
					world.splice(i, 1);

					this.stats[obj.type] += FOOD_POINTS;

					if (this.stats[obj.type] > this.max[obj.type])
						this.stats[obj.type] = this.max[obj.type];
				}

				if (distance < this.visionRange) objInV.push({ distance, obj });
			}
		}
		return objInV;
	}

	draw() {
		// Draw character

		drawCircle("#ffffff08", this.x, this.y, this.visionRange, true);
		draw(this.color, this.x, this.y, false, 1, true);

		//stat bars
		let maxMeter = this.max.food / 4;
		let foodMeter = this.stats.food / 4;
		let waterMeter = this.stats.water / 4;

		drawRect(
			"#4a4a4a",
			this.x + TILE_WIDTH / 2 - maxMeter / 2,
			this.y - 15,
			maxMeter,
			10,
			undefined,
			undefined,
			true
		);
		drawRect(
			"#f40",
			this.x + TILE_WIDTH / 2 - foodMeter / 2,
			this.y - 15,
			foodMeter,
			5,
			false,
			1,
			true
		);

		//
		drawRect(
			"#08f",
			this.x + TILE_WIDTH / 2 - waterMeter / 2,
			this.y - 10,
			waterMeter,
			5,
			false,
			1,
			true
		);

		drawText(
			this.name,
			this.x + TILE_WIDTH / 2,
			this.y - 15,
			12,
			this.placement == 0 ? "gold" : "#fff",
			undefined,
			undefined,
			undefined,
			true
		);
	}
}
