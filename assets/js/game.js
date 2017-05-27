var character = false;
var enemy = false;
var taunts = ["She's a witch!", "It's just a flesh wound", "Go away or I shall taunt you a second time!", "Go and boil your bottoms!", "I blow my nose at you! You and all your silly English K-nigh-hts!", "If you think you got a nasty taunting this time, you ain't heard nothing yet!", "You don't frighten me with your silly knees-bent running around advancing behavior!", "NI!", "You have the brain of a duck!", "BURRRNNNN HERRRRRR", "Fetch us the Holy Hand Grenade!", "You English bedwetting types", "You tiny-brained wipers of other people's bottoms!"]
var chosenCharacter;
var currentEnemy;
var selected;
var base = 0;
var imNotDead;
var imVeryDead;

function Character(attack, counter, health) {
	this.attack = attack;
	this.counter = counter;
	this.health = health;
}

function characterSelect(unit) {
	imNotDead = $(unit).parent();
	$(unit).toggleClass("char character");
	$("#character").append(unit);
	character = true;
	unitBuilder(selected, 0);
}

function enemySelect(unit) {
	if ( $(unit).hasClass("character") ) {
		return;
	}
	imVeryDead = $(unit).parent();
	$(unit).toggleClass("char enemy");
	$("#enemy").append(unit);
	enemy = true;
	unitBuilder(selected, 1);
	$("#taunter").css("visibility", "visible");
}

function unitBuilder(selected, test) {
	switch(selected) {
		case "robin":
			base = 15;
			alignment = new Character(base, 5, 35);
			break;

		case "black":
			base = 30;
			alignment = new Character(base, 10, 45);
			break;

		case "enchanter":
			base = 40;
			alignment = new Character(base, 5, 50);
			break;

		case "french":
			base = 10;
			alignment = new Character(base, 15, 20);
			break;

		case "rabbit":
			base = 10;
			alignment = new Character(base, 20, 60);
			break;

		case "peasants":
			base = 10;
			alignment = new Character(base, 5, 100);
			break;
		
		default:
			console.log(taunts[Math.floor(Math.random() * taunts.length)]);;
			break;
	}
	if (test === 0) {
		chosenCharacter = alignment;
	} else {
		currentEnemy = alignment;
	}
}

function taunt() {
	console.log(taunts[Math.floor(Math.random() * taunts.length)]);
	currentEnemy.health -= chosenCharacter.attack;
	
	chosenCharacter.attack += base;

	if (currentEnemy.health <= 0) {
		winFight(true);
		
	} 

	chosenCharacter.health -= currentEnemy.counter;

	if (chosenCharacter.health <= 0) {
		winFight(false);
			
		}
			
	}


function winFight(winState) {
	if (winState) {
		$("#taunter").css("visibility", "hidden");
		$("#enemy > div").toggleClass("char enemy");
		$(imVeryDead).append($("#enemy > div"));
		$(imVeryDead).css("visibility", "hidden");
		enemy = false;
		imVeryDead = null;
	} else {
		$("#character").empty();
		$("#enemy").empty();
		enemy = false;
		character = false;
	}
	

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