class Character {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.display();
    }

    display() {
        var imageName = this.name.replace(/ /g, '-') + '.jpg';
        this.box = document.createElement('div');
        this.box.setAttribute('class', 'character-box');
        this.box.style.border = '3px ' + this.color + ' solid';
        var image = document.createElement('img');
        image.setAttribute('src', imageName);
        image.setAttribute('width', 180);
        this.box.appendChild(image);
        document.getElementById('characters-box').appendChild(this.box);
    }
}

var characters = [new Character('Luke Skywalker', 'green'),
new Character('Obi-Wan Kenobi', 'blue'),
new Character('Darth Sidius', 'red'),
new Character('Darth Maul', 'red')];