function test() {
    var winningOrders = {};
    for (var i = 0; i < characters.length; ++i) {
        player = characters[i];
        // Make an array of attackable characters.
        var attackables = [];
        characters.forEach(function (c) { if (player.canAttack(c)) attackables.push(c); });
        // Construct an array of orders to attack characters in.
        var orders = [];
        var firstOrder = [];
        for (var j = 0; j < attackables.length; ++j) {
            firstOrder.push(j);
        }
        orders.push(firstOrder.slice());
        // variable to track whether k index found
        var found = true;
        while (found) {
            found = false;
            for (var k = firstOrder.length - 1; k >= 0; --k) {
                if (firstOrder[k] < firstOrder[k + 1]) {
                    // k satisfies condition
                    found = true;
                    break;
                }
            }
            if (found) {
                for (var m = firstOrder.length - 1; m > k; --m) {
                    if (firstOrder[k] < firstOrder[m]) break;
                }
                var swap = firstOrder[k];
                firstOrder[k] = firstOrder[m];
                firstOrder[m] = swap;
                // Reverse elements after k.
                swap = firstOrder.splice(k + 1);
                swap.reverse();
                firstOrder = firstOrder.concat(swap);
                orders.push(firstOrder.slice());
            }
        }
        // orders now contains all possible orders to attack attackables
        winningOrders[player.name] = [];
        for (var j = 0; j < orders.length; ++j) {
            for (var k = 0; k < orders[j].length; ++k) {
                while (attackables[orders[j][k]].hp > 0) {
                    player.attack(attackables[orders[j][k]], false);
                }
            }
            if (player.hp > 0) {
                // Record this order as a winner for player character
                winningOrders[player.name].push(orders[j]);
            }
            // Reset all characters to starting hp
            for (var k = 0; k < characters.length; ++k) characters[k].hp = characters[k].startingHp;
            // Reset player's attack power
            player.AttackPower = player.startingAttack;
        }
    }
    console.log(winningOrders);
}

function sithCount() {
    var count = 0;
    characters.forEach(function (c) { if (c.hp > 0 && c.color === 'red')++count; });
    return count;
}

function jediCount() {
    var count = 0;
    characters.forEach(function (c) { if (c.hp > 0 && c.color !== 'red')++count; });
    return count;
}

class Character {
    constructor(name, color, hp, attackPower, counter) {
        this.name = name;
        this.color = color;
        this.hp = hp;
        this.startingHp = hp;
        this.attackPower = attackPower;
        this.startingAttack = attackPower;
        this.counter = counter;
        this.display();
    }

    display() {
        // Create a div for this character with correct color border
        this.box = $('<div class="character-box" style="border: 3px ' + this.color +
            ' solid; background: ' + (this.color === 'red' ? 'black' : 'white') + '">');
        // Create a p tag for character's name
        var nameTag = $('<p class="character-tag" id="name-tag">')
        nameTag.text(this.name);
        this.box.append(nameTag);
        // Load this character's image
        var image = $('<img src="' + this.name.replace(/ /g, '-') + '.jpg" width=150>');
        this.box.append(image);
        // Create a p tag for character's hp
        var hpTag = $('<p class="character-tag" id="hp-tag">')
        hpTag.text(this.hp);
        this.box.append(hpTag);
        // Store this for use inside click function
        var that = this;
        this.box.on('click', function () {
            $('#characters-box').remove();
            $('#player-character-box').append($('<h2>').text('Your Character'));
            $('#player-character-box').append(that.box);
            player = that;
            that.fillEnemyBoxes();
        });
        $('#characters-box').append(this.box);
    }

    canAttack(other) {
        return other.name !== this.name &&
            other.hp > 0 &&
            ((this.color === 'red' && (sithCount() > 2 || other.color !== 'red')) ||
                other.color === 'red');
    }

    fillEnemyBoxes() {
        $('#enemies-box').append($('<h2 class="centered">').text('Choose an Enemy to Attack'))
        for (var i = 0; i < characters.length; ++i) {
            if (this.canAttack(characters[i])) {
                characters[i].box.on('click', function () {
                    $('#enemies-box').empty();
                    var attackButton = $('<button class="attack-button">');
                    attackButton.text('Attack');
                    // Name of defending character
                    var defenderName = $(this).children('#name-tag').text();
                    // Defending character found by name
                    defender = characters[characters.findIndex(function (c) {
                        return c.name === defenderName;
                    })];
                    attackButton.on('click', function () {
                        // Player attacks defender
                        if (player.attack(defender)) {
                            // defender died
                            if ((player.color !== 'red' && sithCount()) ||
                                (player.color === 'red' && (jediCount() || sithCount() > 2))) {
                                // enemies remain
                                $('#attack-button-box').empty();
                                $('#defender-box').empty();
                                player.fillEnemyBoxes();
                            } else {
                                // no enemies remain
                                $('section').empty();
                                $('section').append($('<h1>').text('You Win'));
                            }
                        } else if (player.hp <= 0) {
                            // player died
                            $('section').empty();
                            $('section').append($('<h1>').text('Game Over'));
                        }
                    });
                    $('#attack-button-box').append(attackButton);
                    $('#defender-box').append($(this));
                });
                $('#enemies-box').append(characters[i].box);
            }
        }

    }

    attack(other, record=true) {
        // Attack other, return true if other is dead otherwise return false.
        other.hp -= ++this.attackPower;
        if (other.hp <= 0) {
            if (record) $('#combat-log').append(this.name + ' attacks ' + other.name + ' for ' +
                this.attackPower + ' damage. ' + other.name + ' dies.<br>');
            return true;
        }
        this.hp -= other.counter;
        if (this.hp <= 0) {
            if (record) $('#combat-log').append(other.name + ' attacks ' + this.name + ' for ' +
                other.counter + ' damage. ' + this.name + ' dies.<br>');
            return false;
        }
        if (record) $('#combat-log').append(this.name + ' attacks ' + other.name + ' for ' +
            this.attackPower + ' damage. ' + other.name + '\'s HP: ' + other.hp + '<br>');
        if (record) $('#combat-log').append(other.name + ' attacks ' + this.name + ' for ' +
            other.counter + ' damage. ' + this.name + '\'s HP: ' + this.hp + '<br>');
        return false;
    }
}

var characters = [new Character('Luke Skywalker', 'green', 100, 22, 10),
new Character('Obi-Wan Kenobi', 'blue', 120, 20, 9),
new Character('Yoda', 'green', 150, 16, 6),
new Character('Mace Windu', 'purple', 110, 23, 9),
new Character('Darth Sidius', 'red', 150, 17, 7),
new Character('Darth Vader', 'red', 130, 24, 10),
new Character('Darth Maul', 'red', 100, 27, 12),
new Character('Count Dooku', 'red', 120, 19, 11)];

var player;
var defender;