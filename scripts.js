class Character {
    constructor(name, color, hp) {
        this.name = name;
        this.color = color;
        this.hp = hp;
        this.display();
    }

    display() {
        // Create a div for this character with correct color border
        var box = $('<div class="character-box" style="border: 3px ' + this.color + ' solid">');
        // Create a p tag for character's name
        var nameTag = $('<p class="character-tag" id="name-tag">')
        nameTag.text(this.name);
        box.append(nameTag);
        // Load this character's image
        var image = $('<img src="' + this.name.replace(/ /g, '-') + '.jpg" width=180>');
        box.append(image);
        // Create a p tag for character's hp
        var hpTag = $('<p class="character-tag" id="hp-tag">')
        hpTag.text(this.hp);
        box.append(hpTag);
        // Store this for use inside functions
        var that = this;
        box.on('click', function () {
            $('#characters-box').remove();
            $('#player-character-box').append(box);
            player = that;
            for (var i = 0; i < characters.length; ++i) {
                if (that.color === 'red' || characters[i].color === 'red') {
                    // This is sith or other is sith.
                    characters[i].box.on('click', function() {
                        $('#enemies-box').empty();
                        var attackButton = $('<button class="attack-button">');
                        attackButton.text('Attack');
                        // Name of defending character
                        var defenderName = $(this).children('#name-tag').text();
                        // Defending character found by name
                        defender = characters[characters.findIndex(function(c) {
                            return c.name === defenderName;
                        })];
                        attackButton.on('click', function () {
                            
                        });
                        $('#attack-button-box').append(attackButton);
                        $('#defender-box').append($(this));
                    });
                    $('#enemies-box').append(characters[i].box);
                }
            }
        });
        $('#characters-box').append(box);
        // Store box as member of character class
        this.box = box;
    }
}

var characters = [new Character('Luke Skywalker', 'green', 100),
new Character('Obi-Wan Kenobi', 'blue', 120),
new Character('Mace Windu', 'purple', 120),
new Character('Darth Sidius', 'red', 150),
new Character('Darth Maul', 'red', 100),
new Character('Count Dooku', 'red', 120)];

var player;
var defender;