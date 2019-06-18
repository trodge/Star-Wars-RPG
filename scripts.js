function permutate(array) {
    // Return an array of all permutations of parameter array
    var permutations = [];
    var a = array.slice();
    permutations.push(a.slice());
    // variable to track whether k index found
    var found = true;
    while (found) {
        found = false;
        for (var k = a.length - 1; k >= 0; --k) {
            if (a[k] < a[k + 1]) {
                // k satisfies condition
                found = true;
                break;
            }
        }
        if (found) {
            for (var m = a.length - 1; m > k; --m) {
                if (a[k] < a[m]) break;
            }
            var swap = a[k];
            a[k] = a[m];
            a[m] = swap;
            // Reverse elements after k.
            swap = a.splice(k + 1);
            swap.reverse();
            a = a.concat(swap);
            permutations.push(a.slice());
        }
    }
    return permutations;
}

function test(p) {
    // Test the paths of a character and return winning paths.
    // Test all characters if none specified.
    if (!p) {
        var winningOrders = {};
        for (var i = 0; i < characters.length; ++i)
            winningOrders[characters[i].name] = test(characters[i]);
        return winningOrders;
    }
    // Make an array of attackable characters.
    var attackables = [];
    characters.forEach(function (c) { if (p.canAttack(c)) attackables.push(c); });
    // Construct an array of orders to attack characters in.
    var orders = [];
    var firstOrder = [];
    for (var j = 0; j < attackables.length; ++j) {
        firstOrder.push(j);
    }
    if (p.color === 'red') {
        // Remove each other sith from first order and permutate then concatenate onto orders
        for (var j = 0; j < attackables.length; ++j) {
            if (attackables[j].color === 'red') {
                firstOrder.splice(j, 1);
                orders = orders.concat(permutate(firstOrder));
                firstOrder.splice(j, 0, j);
            }
        }
    } else orders = permutate(firstOrder);
    // orders now contains all possible orders to attack attackables
    winningOrders = [];
    for (var j = 0; j < orders.length; ++j) {
        for (var k = 0; k < orders[j].length; ++k) {
            while (attackables[orders[j][k]].hp > 0) {
                p.attack(attackables[orders[j][k]], false);
            }
        }
        if (p.hp > 0) {
            // Record this order as a winner for p character
            winningOrders.push(orders[j].map(m => attackables[m].name));
        }
        // Reset all characters to starting hp
        for (var k = 0; k < characters.length; ++k) characters[k].hp = characters[k].startingHp;
        // Reset p's attack power
        p.attackPower = p.startingAttack;
    }
    // If a character has no winning paths, increase starting attack and test again
    if (!winningOrders.length) {
        p.attackPower = ++p.startingAttack;
        console.log('increased ' + p.name + ' to ' + p.startingAttack);
        return test(p);
    }
    return winningOrders;
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
            $('#p-character-box').append($('<h2>').text('Your Character'));
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
                    attackButton.css({'margin': 'auto', 'width': '100px'});
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
                                $('section').append($('<h1 class="centered">').text('You Win'));
                            }
                        } else if (player.hp <= 0) {
                            // player died
                            $('section').empty();
                            $('section').append($('<h1 class="centered">').text('Game Over'));
                        }
                    });
                    $('#attack-button-box').append(attackButton);
                    $('#defender-box').append($(this));
                });
                $('#enemies-box').append(characters[i].box);
            }
        }

    }

    attack(other, record = true) {
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

var characters = [new Character('Luke Skywalker', 'green', 100, 30, 10),
new Character('Obi-Wan Kenobi', 'blue', 120, 23, 9),
new Character('Yoda', 'green', 150, 15, 6),
new Character('Mace Windu', 'purple', 110, 27, 9),
new Character('Darth Sidius', 'red', 150, 21, 7),
new Character('Darth Vader', 'red', 130, 26, 10),
new Character('Darth Maul', 'red', 100, 35, 12),
new Character('Count Dooku', 'red', 120, 31, 11)];

var player;
var defender;