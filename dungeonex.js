const prompts = require('prompts');

class Adventurer {
  constructor(hitpoints, attackpoints, hitchance, currentposition) {
      this.hitpoints = hitpoints;
      this.attackpoints = attackpoints;
      this.hitchance = hitchance;
      this.currentposition = currentposition;
  }

  increaseAttack() {
    this.attackpoints += 1;
      console.log("Your attack damage has increased by 1");
  }

  decreaseAttack() {
    this.attackpoints -= 1;
      console.log("Your attack damage has decreased by 1");
  }

  increaseHitPoints() {
    this.hitpoints += 1;
      console.log("Your hit points have increased by 1");     
  }

  lookAround(map) {//
    return map[this.currentposition].roomDescription;
  }

  moveFurther(){//
    this.currentposition ++;
  }
  
  attackEnemy(){
    let strike = Math.floor(Math.random() * 100);
      if (strike < adventurer.hitchance){
        console.log("You hit the " + Enemy + "for " + adventurer.attackpoints + (" damage!"));
      Enemy.hitpoints -= adventurer.attackpoints;
      if (Enemy.hitpoints == 0){
        console.log("Enemy defeated!");
      }
      else{
        if (Enemy.hitpoints == 0){
          console.log("What the hell are you doing? Its dead already!");
        }
      }
      if (strike > adventurer.hitchance){
        console.log("Missed!");
      }
    }
  }

  displayInformation() {
    console.log('Player HP: ' + this.hitpoints + ', Attack Damage: ' + this.attackpoints + ', Hit Chance: ' + this.hitchance + ', Current location: ' + this.currentposition);
  }
}


// An individual room. Holds properties and behavior for one room
class Room {
  constructor(roomID, roomName, roomNPC, roomDescription){
    this.roomID = roomID;
    this.roomName = roomName;
    this.roomNPC = roomNPC;
    this.roomDescription = roomDescription;
  }
}

//Enemies created extending from adventurer properties.
class Enemy extends Adventurer {
  constructor(hitpoints, attackpoints, hitchance, currentposition) {
   super (hitpoints, attackpoints, hitchance, currentposition);
  }
}

//Enemies extending from the Enemy class.
class Rat extends Enemy {
  constructor() {
    super(2, 1, 0.5, 2);
  }
ratAttackPlayer(){
  if (rat.hitpoints > 0) {
    if (Math.floor(Math.random() * 100) < rat.hitchance) {
      console.log("Ouch! a Rat hit you for " + rat.attackpoints);
      adventurer.hitpoints = hitpoints - rat.attackpoints;
   if (adventurer.hitpoints > 0) {
        console.log("You still have some health left. Continue!");
   } 
   else {
        console.log("You got beaten by a Rat, thats embarrasing...\nTry again!");
        process.exit();
      }
   } 
  } else {
    console.log("You dodged the Rats attack!");
  }
}
}

class Dragon extends Enemy {
  constructor() {
    super(4, 8, 0.9, 3);
  }
  dragonAttackPlayer(){
      if (dragon.hitpoints > 0) {
        if (Math.floor(Math.random() * 100) < dragon.hitchance) {
          console.log("A massive fire blast engulfs you and hits you for a staggering " + dragon.attackpoints + " damage.");
          adventurer.hitpoints = adventurer.hitpoints - dragon.attackpoints;
          if (adventurer.hitpoints > 0) {
            console.log("You still have some health left. Continue!");
           } 
          } else {
            console.log("You died to the Giant Dragon.\nTry again!");
            process.exit();
          } 
        } else {
            console.log( "You dodged the fire breathing Dragons attack!");
          }
       }
  }

//variables used to create the enemies
let rat = new Rat();
let dragon = new Dragon();

//The map creator array when game starts. Fetches this data to create the rooms.
let map = [ new Room(0, 'The Dungeon Entrance', [], 'The entrance looks scary'),
new Room(1, 'The Hallway', Rat, 'The hallway is long and hard'),
new Room(2, 'Chamber of Rodents', Rat, 'It smells like rats here...'),
new Room(3, 'Draconic Gateway', Dragon, 'Whats that? It looks horrifying! Its a Salmon-snake!'),
new Room(4, 'Portal Room', [], 'Youve reached the Draconic Gateway. Step in to the portal to win the game!')
];

//variable for creating the dungeon adventurer when game starts
let adventurer = new Adventurer(10, 2, 0.75, 0);  

//Game functionality
async function gameLoop() {
    let continueGame = true;

    // Example set of UI options for the user to select
    const initialActionChoices = [
        { title: 'Look Around', value: 'lookAround' },
        { title: 'Go to Room', value: 'goToRoom' },
        { title: 'Attack', value: 'attack'},
        {title: 'Info', value: 'info'},
        { title: 'Exit game', value: 'exit'}
    ];

    // Show the list of options for the user.
    // The execution does not proceed from here until the user selects an option.
    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });

    // Deal with the selected value
    console.log('You selected ' + response.value);
    switch(response.value) {
      case 'goToRoom':
        adventurer.moveFurther();
        if (adventurer.currentposition === 5){
          console.log('Congratulations! You have cleared the dungeon!\n\nYour stats at the end of this run: ') + adventurer.displayInformation();
          process.exit();
        }
        if (map[adventurer.currentposition].roomNPC == Rat){
          ratAttackPlayer();
        }
        if (map[adventurer.currentposition].roomNPC == Dragon){
          dragonAttackPlayer();
        }
        break;
      
      case 'lookAround':
        console.log(adventurer.lookAround(map));
        if (map[adventurer.currentposition] == 2){
          ratAttackPlayer();
        }
        if (map[adventurer.currentposition] == 4){
          dragonAttackPlayer();
        }
        break;
      
      case 'attack':
        adventurer.attackEnemy();
        break;
      
      case 'info':
        adventurer.displayInformation();
        break;
      
      case 'exit':
        continueGame = false;
        break;
    }
    
    if(continueGame) {
      gameLoop();
    }    
}

process.stdout.write('\033c'); // clear screen on windows

console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();
