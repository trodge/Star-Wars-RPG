class Character {
    constructor(name, color, hp, attackPower, counter) {
        this.name = name;
        this.color = color;
        this.hp = hp;
        this.attackPower = attackPower;
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
        var image = $('<img src="' + this.name.replace(/ /g, '-') + '.jpg" width=180>');
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

    fillEnemyBoxes() {
        $('#enemies-box').append($('<h2 class="centered">').text('Choose an Enemy to Attack'))
        for (var i = 0; i < characters.length; ++i) {
            if (characters[i].name !== this.name &&
                characters[i].hp > 0 &&
                (this.color === 'red' || characters[i].color === 'red')) {
                // This is sith or other is sith.
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
                            $('#attack-button-box').empty();
                            $('#defender-box').empty();
                            player.fillEnemyBoxes();
                        }
                        if (player.hp <= 0) {
                            // player died
                            
                        }
                    });
                    $('#attack-button-box').append(attackButton);
                    $('#defender-box').append($(this));
                });
                $('#enemies-box').append(characters[i].box);
            }
        }

    }

    attack(other) {
        // Attack other, return true if other is dead otherwise return false.
        other.hp -= ++this.attackPower;
        if (other.hp <= 0) {
            $('#combat-log').append(this.name + ' attacks ' + other.name + ' for ' +
                this.attackPower + ' damage. ' + other.name + ' dies.<br>');
            return true;
        }
        this.hp -= other.counter;
        if (this.hp <= 0) {
            $('#combat-log').append(other.name + ' attacks ' + this.name + ' for ' +
                other.counter + ' damage. ' + this.name + ' dies.<br>');
            return false;
        }
        $('#combat-log').append(this.name + ' attacks ' + other.name + ' for ' +
            this.attackPower + ' damage. ' + other.name + '\'s HP: ' + other.hp + '<br>');
        $('#combat-log').append(other.name + ' attacks ' + this.name + ' for ' +
            other.counter + ' damage. ' + this.name + '\'s HP: ' + this.hp + '<br>');
        return false;
    }
}

var characters = [new Character('Luke Skywalker', 'green', 100, 20, 10),
new Character('Obi-Wan Kenobi', 'blue', 120, 18, 9),
new Character('Mace Windu', 'purple', 110, 19, 9),
new Character('Darth Sidius', 'red', 150, 15, 7),
new Character('Darth Maul', 'red', 100, 25, 12),
new Character('Count Dooku', 'red', 120, 23, 11)];

var player;
var defender;