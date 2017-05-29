var dead = false;
var character = false;
var enemy = false;
var taunts = ["She's a witch!", "It's just a flesh wound", "Go away or I shall taunt you a second time!", "Go and boil your bottoms!", "I blow my nose at you! You and all your silly English K-nigh-hts!", "If you think you got a nasty taunting this time, you ain't heard nothing yet!", "You don't frighten me with your silly knees-bent running around advancing behavior!", "NI!", "You have the brain of a duck!", "BURRRNNNN HERRRRRR", "Fetch us the Holy Hand Grenade!", "You English bedwetting types", "You tiny-brained wipers of other people's bottoms!"]
var chosenCharacter;
var currentEnemy;
var selected;
var base = 0;
var characterReset;
var enemyDead;
var wins = 0;

var message = new Audio("./assets/sound/message.wav");
var invincible = new Audio("./assets/sound/invincible.wav");
var pointy = new Audio("./assets/sound/pointy.wav");
var runaway = new Audio("./assets/sound/runaway.wav");

function Character(attack, counter, health) {
	this.base = attack;
	this.attack = attack;
	this.counter = counter;
	this.health = health;
}

function characterSelect(unit) {
	$("#combat").empty();
	characterReset = $(unit).parent();
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
	enemyDead = $(unit).parent();
	$(unit).toggleClass("char enemy");
	$("#enemy").append(unit);
	enemy = true;
	unitBuilder(selected, 1);
	$("#taunter").css("visibility", "visible");
	$("#instr").text("They look pretty tough, watch out!");
	$("#enemyhp").text("Health: " + currentEnemy.health);
}

//generate new character objects based on user selections
function unitBuilder(selected, test) {
	switch(selected) {
		case "robin":
			alignment = new Character(16, 11, 90);
			break;

		case "black":
			alignment = new Character(32, 16, 80);
			break;

		case "enchanter":
			alignment = new Character(38, 9, 85);
			break;

		case "french":
			alignment = new Character(17, 21, 90);
			break;

		case "rabbit":
			alignment = new Character(10, 24, 110);
			break;

		case "peasants":
			alignment = new Character(5, 2.5, 211);
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
	$("#instr").text(taunts[Math.floor(Math.random() * taunts.length)]);
	
	//Combat exchange using object properties
	currentEnemy.health -= chosenCharacter.attack;
	$("#enemyhp").text("Health: " + currentEnemy.health);
	chosenCharacter.attack += chosenCharacter.base;
	$("#combat").html("You taunted them for a pitiful " + chosenCharacter.attack + " damage. <br> They taunted you right back for " + currentEnemy.counter + " damage.");


	//Check if enemy is dead first then player based off of dead bool
	if (currentEnemy.health <= 0) {
		$("#instr").html("Oh you got them good <br>Choose your next victim!");
		$("#enemyhp").empty();
		dead = true;
		winFight(true);
	} 
	if (!dead) {
		chosenCharacter.health -= currentEnemy.counter;
		$("#charhp").text("Health: " + chosenCharacter.health);
		if (chosenCharacter.health <= 0) {
			$("#charhp").text("Health: 0");
			winFight(false);
		}
	}		
}	

//handling for whether character or enemy died and starting setup for new game
function winFight(winState) {
	if (winState) {
		$("#taunter").css("visibility", "hidden");
		$("#enemy > div").toggleClass("char enemy");
		$("#enemy > div").css("visibility", "hidden");
		$(enemyDead).html($("#enemy > div"));
		enemy = false;
		enemyDead = null;
		wins++;
		if (wins === 5 && chosenCharacter.health >= 0) {
			invincible.play();
			dead = true;
			winGame(true);
		}
	} else {
		$("#enemy > div").toggleClass("char enemy");
		$(enemyDead).html($("#enemy > div"));
		$("#enemy").empty();
		enemy = false;
		wins = 0;
		winGame(false);
	}
}

//control for whether the game was lost or won and finalizing reset
function winGame(test) {
	$(document).ready(function() {
		if (test) {
			$("#combat").html("Congratulations, you have taunted them fiercely.");
			var agree = confirm("Would you like to continue your search for the grail?");
		} else {
			message.play();
			$("#combat").html("Tis just a flesh wound.");
			var agree = confirm("You were taunted quite viciously and had to run away.\nWould you like to play again?");
		}
		
		if (agree) {
			$("#taunter").css("visibility", "hidden");
			$("#character > div").toggleClass("char character");
			$(".char").css("visibility", "visible");
			$(characterReset).html($("#character > div"));
			character = false;
			$("#charhp").empty();
			$("#enemyhp").empty();
			$("#instr").html("Choose your next champion!");
			wins = 0;
		} else {
			runaway.play();
			character = true;
			enemy = true;
			$("#taunter").css("visibility", "hidden");
			$("#instr").text("Oh had enough have you?");
		}
	});
}


//listeners for clicks on items
$(document).ready(function() {

	pointy.play();
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