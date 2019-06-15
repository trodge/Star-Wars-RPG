class Character {
    constructor(name, color, hp) {
        this.name = name;
        this.color = color;
        this.hp = hp;
        this.display();
    }

    display() {
        var imageName = this.name.replace(/ /g, '-') + '.jpg';
        this.box = document.createElement('div');
        this.box.setAttribute('class', 'character-box');
        this.box.style.border = '3px ' + this.color + ' solid';
        var nameTag = document.createElement('p');
        nameTag.setAttribute('class', 'character-tag');
        nameTag.innerHTML = this.name;
        this.box.appendChild(nameTag);
        var image = document.createElement('img');
        image.setAttribute('src', imageName);
        image.setAttribute('width', 180);
        this.box.appendChild(image);
        var hpTag = document.createElement('p');
        hpTag.setAttribute('class', 'character-tag');
        hpTag.innerHTML = this.hp;
        this.box.appendChild(hpTag);
        document.getElementById('characters-box').appendChild(this.box);
    }
}

var characters = [new Character('Luke Skywalker', 'green', 120),
new Character('Obi-Wan Kenobi', 'blue', 100),
new Character('Darth Sidius', 'red', 150),
new Character('Darth Maul', 'red', 100)];