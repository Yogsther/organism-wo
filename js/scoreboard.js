var scoreboard = {
	x: 10,
	y: 10,
	width: 250,
	height: 390,
	expanded: false
};

var expandScoreboard = new CanvasButton(
	"+",
	scoreboard.x + scoreboard.width,
	scoreboard.y,
	30,
	30,
	() => {
		scoreboard.expanded = !scoreboard.expanded;
		if (scoreboard.expanded) expandScoreboard.text = "-";
		else expandScoreboard.text = "+";
	}
);

for (let i = 0; i < 10; i++) {
	new CanvasButton(
		"",
		scoreboard.x + 20,
		scoreboard.y + 54 + i * 32,
		200,
		20,
		() => {
			lockOn(i);
		},
		"rgba(0,0,0,0)"
	);
}

function lockOn(index) {
	var creature = worldCreatures[index];
	if (creature.id === locked) {
		locked = false;
	} else {
		locked = creature.id;
		console.log(creature.name, index);
	}
}

function updateScoreboard() {}

function drawScoreboard() {
	drawRect(
		"rgba(0,0, 0, .5)",
		scoreboard.x,
		scoreboard.y,
		scoreboard.width,
		scoreboard.height
	);
	if (scoreboard.expanded)
		drawRect(
			"#00000088",
			scoreboard.x + scoreboard.width,
			scoreboard.y,
			scoreboard.width,
			scoreboard.height,
			false
		);

	drawText("Scoreboard", 20, 50, 30, "white", "Arial", "left");
	var spacing = 32;
	for (var i = 0; i < 10; i++) {
		if (worldCreatures[i]) {
			let creature = worldCreatures[i];
			let color = "#a3a3a3";
			if (i == 0) color = "gold";
			if (i == 1) color = "silver";
			if (i == 2) color = "darkorange";
			drawText(
				`${i + 1}.`,
				scoreboard.x + 10,
				scoreboard.y + 70 + i * spacing,
				15,
				color,
				"Arial",
				"left"
			);
			drawText(
				creature.name + (locked === creature.id ? " (L)" : ""),
				50,
				80 + i * spacing,
				15,
				color,
				"Arial",
				"left"
			);
			drawText(
				`${creature.lifetime}`,
				scoreboard.width,
				80 + i * spacing,
				15,
				color,
				"Arial",
				"right"
			);

			//stat bars
			let foodMeter =
				(creature.stats.food / creature.max.food) *
				(scoreboard.width - 20);
			let waterMeter =
				(creature.stats.water / creature.max.water) *
				(scoreboard.width - 20);
			drawRect(
				"#f44",
				scoreboard.x + 10,
				85 + i * spacing,
				foodMeter,
				5,
				false,
				1
			);
			drawRect(
				"#08f",
				scoreboard.x + 10,
				90 + i * spacing,
				waterMeter,
				5,
				false,
				1
			);

			if (scoreboard.expanded) {
				drawText(
					`x: ${Math.round(creature.x)}`,
					scoreboard.x + scoreboard.width + 10,
					scoreboard.y + 55 + i * spacing,
					10,
					color,
					"monospace",
					"left",
					"top"
				);
				drawText(
					`y: ${Math.round(creature.y)}`,
					scoreboard.x + scoreboard.width + 10,
					scoreboard.y + 65 + i * spacing,
					10,
					color,
					"monospace",
					"left",
					"top"
				);

				drawText(
					`ts: ${creature.turnSpeed}`,
					scoreboard.x + scoreboard.width + 60,
					scoreboard.y + 55 + i * spacing,
					10,
					color,
					"monospace",
					"left",
					"top"
				);
				drawText(
					`tf: ${creature.turnFrequency}`,
					scoreboard.x + scoreboard.width + 60,
					scoreboard.y + 65 + i * spacing,
					10,
					color,
					"monospace",
					"left",
					"top"
				);

				drawText(
					`s: ${creature.speed}`,
					scoreboard.x + scoreboard.width + 110,
					scoreboard.y + 55 + i * spacing,
					10,
					color,
					"monospace",
					"left",
					"top"
				);
			}
		}
	}
}
