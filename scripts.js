class Character {
    constructor(name, color, hp) {
        this.name = name;
        this.color = color;
        this.hp = hp;
        this.display();
    }

    display() {
        this.box = $('<div class="character-box" style="border: 3px + ' + this.color + ' solid"');
        var nameTag = $('<p class="character-tag">')
        nameTag.text(this.name);
        this.box.append(nameTag);
        var image = $('<img src="' + this.name.replace(/ /g, '-') + '.jpg" width=180');
        this.box.append(image);
        var hpTag = $('<p class="character-tag">')
        hpTag.text(this.hp);
        this.box.append(hpTag);
        this.box.on('click', function () {
        });
        document.getElementById('characters-box').appendChild(this.box);
    }
}

var characters = [new Character('Luke Skywalker', 'green', 100),
new Character('Obi-Wan Kenobi', 'blue', 120),
new Character('Mace Windu', 'purple', 120),
new Character('Darth Sidius', 'red', 150),
new Character('Darth Maul', 'red', 100),
new Character('Count Dooku', 'red', 120)];