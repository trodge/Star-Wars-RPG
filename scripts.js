class Character {
    constructor(name) {
        this.name = name;
        this.display();
    }

    display() {
        var imageName = this.name.replace(/ /g, '-') + '.jpg';
        this.box = document.createElement('div');
        this.box.setAttribute('class', 'character-box');
        var image = document.createElement('img');
        image.setAttribute('src', imageName);
        this.box.appendChild(image);
        document.getElementById('characters-box').appendChild(this.box);
    }
}

var characters = [new Character('Luke Skywalker'),
new Character('Obi-Wan Kenobi'),
new Character('Darth Sidius'),
new Character('Darth Maul')];