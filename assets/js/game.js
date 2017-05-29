var dead = false;
var character = false;
var enemy = false;
var taunts = ["She's a witch!", "It's just a flesh wound", "Go away or I shall taunt you a second time!", "Go and boil your bottoms!", "I blow my nose at you! You and all your silly English K-nigh-hts!", "If you think you got a nasty taunting this time, you ain't heard nothing yet!", "You don't frighten me with your silly knees-bent running around advancing behavior!", "NI!", "You have the brain of a duck!", "BURRRNNNN HERRRRRR", "Fetch us the Holy Hand Grenade!", "You English bedwetting types", "You tiny-brained wipers of other people's bottoms!"]
var chosenCharacter;
var currentEnemy;
var selected;
var base = 0;
var imNotDead;
var imVeryDead;
var wins = 0;

function Character(base, attack, counter, health) {
	this.base = base;
	this.attack = attack;
	this.counter = counter;
	this.health = health;
}

function characterSelect(unit) {
	$("#combat").empty();
	imNotDead = $(unit).parent();
	$(unit).toggleClass("char character");
	$("#character").html(unit);
	character = true;
	unitBuilder(selected, 0);
	$("#instr").text("I guess they're okay, now choose an enemy!");
	$("#charhp").text("Health: " + chosenCharacter.health);
}

function enemySelect(unit) {
	dead = false;
	if ( $(unit).hasClass("character") ) {
		return;
	}
	imVeryDead = $(unit).parent();
	$(unit).toggleClass("char enemy");
	$("#enemy").append(unit);
	enemy = true;
	unitBuilder(selected, 1);
	$("#taunter").css("visibility", "visible");
	$("#instr").text("They look pretty tough, watch out!");
	$("#enemyhp").text("Health: " + currentEnemy.health);
}

function unitBuilder(selected, test) {
	switch(selected) {
		case "robin":
			alignment = new Character(16, 16, 11, 90);
			break;

		case "black":
			alignment = new Character(32, 32, 16, 80);
			break;

		case "enchanter":
			alignment = new Character(38, 38, 9, 85);
			break;

		case "french":
			alignment = new Character(17, 17, 21, 90);
			break;

		case "rabbit":
			alignment = new Character(10, 10, 24, 110);
			break;

		case "peasants":
			alignment = new Character(5, 5, 2.5, 211);
			break;
		
		default:
			console.log(taunts[Math.floor(Math.random() * taunts.length)]);;
	}
	if (test === 0) {
		chosenCharacter = alignment;
	} else {
		currentEnemy = alignment;
	}
}

function taunt() {
	//Controls whether or not you win on last hit of a fight
	console.log(taunts[Math.floor(Math.random() * taunts.length)]);
	
	//Combat exchange using object properties
	currentEnemy.health -= chosenCharacter.attack;
	$("#enemyhp").text("Health: " + currentEnemy.health);
	chosenCharacter.attack += chosenCharacter.base;
	$("#combat").html("You taunted them for a pitiful " + chosenCharacter.attack + " damage. <br> They taunted you right back for " + currentEnemy.counter + " damage.");
	chosenCharacter.health -= currentEnemy.counter;
	$("#charhp").text("Health: " + chosenCharacter.health);


	//Check if enemy is dead first then player
	if (currentEnemy.health <= 0) {
		$("#instr").html("That was nasty, you kiss your mother with that mouth? <br> Choose your next victim!");
		$("#enemyhp").empty();
		winFight(true);
	} else if (chosenCharacter.health <= 0) {
		$("#charhp").text("Health: 0");
		var agree = confirm("You were taunted quite viciously and had to run away.\nWould you like to play again?")
		if (agree) {
			winFight(false);
		} else {
			character = true;
			enemy = true;
			$("#taunter").css("visibility", "hidden");
			$("#instr").text("Oh had enough have you?");
		}
	}
			
}	

function winFight(winState) {
	if (winState) {
		$("#taunter").css("visibility", "hidden");
		$("#enemy > div").toggleClass("char enemy");
		$(imVeryDead).html($("#enemy > div"));
		$(imVeryDead).css("visibility", "hidden");
		enemy = false;
		imVeryDead = null;
		wins++;
		if (wins === 5 && chosenCharacter.health >= 0) {
			dead = true;
			winGame();
		}
	} else {
		$("#character > div").toggleClass("char character");
		$(imNotDead).html($("#character > div"));
		$("#charhp").empty();
		$("#enemy").empty();
		$(".char").css("visibility", "visible");
		$("#instr").html("Tis just a flesh wound.")
		enemy = false;
		character = false;
	}
}

function winGame() {
	$(document).ready(function() {
		$("#combat").html("Congratulations, you have taunted them fiercely.");
		var agree = confirm("Would you like to continue your search for the grail?");
		if (agree) {
			$(".char").css("visibility", "visible");
			$("#character > div").toggleClass("char character");
			$(imNotDead).append($("#character > div"));
			character = false;
			enemy = false;
			$("#charhp").empty();
			$("#instr").html("Choose your new champion!");
			wins = 0;
		}
	});
}

$(document).ready(function() {

	$(".char").click(function() {
		selected = $(this).attr("id");
		if (!character) {
			characterSelect(this);
		} else if (character && !enemy) {
			enemySelect(this);
		}
	});
	$("#taunter").click(taunt);
});