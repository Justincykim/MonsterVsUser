const attackValue = 10;
const monsterAttackValue = 14;
const strongAttackValue = 17;
const HEAL_Value = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK =  "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Maximum life for you and the monster.", "100");

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;


adjustHealthBars(chosenMaxLife);


function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry;
    if (ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }else if (ev === LOG_EVENT_MONSTER_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }else if (ev === LOG_EVENT_PLAYER_HEAL){
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }else if (ev === LOG_EVENT_GAME_OVER){
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }
    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}


function resetLog(){
    if(currentMonsterHealth === 100 && currentPlayerHealth === 100){
        battleLog = [];
    }
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(monsterAttackValue);
    
    if(currentPlayerHealth - playerDamage <= 0){
        currentPlayerHealth = 0;
    }else{
        currentPlayerHealth -= playerDamage;
    }

    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if (currentPlayerHealth <=0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but the bonus life saved you!");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth >= 0){
        writeToLog(LOG_EVENT_GAME_OVER, 'Player WON', currentMonsterHealth, currentPlayerHealth);
        alert("You Won!");
        reset();

    } else if (currentPlayerHealth <= 0 && currentMonsterHealth >= 0){
        writeToLog(LOG_EVENT_GAME_OVER, 'Monster WON', currentMonsterHealth, currentPlayerHealth);
        alert("You Lost!");
        reset();

    } else if(currentPlayerHealth <= 0 && currentMonsterHealth <= 0){
        writeToLog(LOG_EVENT_GAME_OVER, "TIE", currentMonsterHealth, currentPlayerHealth);
        alert("You have a draw!");
        reset();

    }
}

function attackMonster(mode){
    const maxDamage = mode === MODE_ATTACK ? attackValue : strongAttackValue;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if(mode === MODE_ATTACK){
    //     maxDamage = attackValue
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }else if (mode === MODE_STRONG_ATTACK) {
    //     maxDamage = strongAttackValue;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }

    const damage = dealMonsterDamage(maxDamage);

    if(currentMonsterHealth - damage <= 0){
        currentMonsterHealth = 0;
    }else{
        currentMonsterHealth -= damage;
    }
    
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

    
    endRound();
}

function attackHandler() {
    resetLog();
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    resetLog();
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    resetLog();
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_Value){
        alert("You can't heal to more than your max inital health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    }else{ 
        healValue = HEAL_Value;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;

    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);

    endRound();
}

function printLogHandler() {
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler);