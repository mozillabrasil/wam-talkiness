$(document).ready(function () {
    Reveal.addEventListener('play_video', function ($event) {
        var video = document.querySelector('video');
        console.log(video);
        if (video) {
            video.play();
        }
    });
});

VIDEO = {
    videoObject: '#video',
    addSubtitle: function (start, end, subtitle) {
        Popcorn(this.videoObject).cue(start, function () {
            VIDEO.displaySubtitle(subtitle);
        });
        Popcorn(this.videoObject).cue(end, function () {
            VIDEO.removeSubtitle();
        });
    },
    displaySubtitle: function (subtitle) {
        document.getElementById('substitles').innerHTML = '<p>' + subtitle + '</p>';
    },
    removeSubtitle: function () {
        document.getElementById('substitles').innerHTML = ' ';
    }
};
document.addEventListener("DOMContentLoaded", function () {

    VIDEO.addSubtitle(29.8, 32, 'A habilidade de trabalhar em conjunto');
    VIDEO.addSubtitle(32, 34.3, 'para formar e fortalecer esta comunidade');
    VIDEO.addSubtitle(34.3, 36, 'com a missão que foi dada');
    VIDEO.addSubtitle(36, 37.8, 'é a chave para o nosso sucesso');

    VIDEO.addSubtitle(54.8, 56.8, 'Nós somos a causa');
    VIDEO.addSubtitle(56.9, 60, 'e a idéia de poder mudar as coisas.');
    VIDEO.addSubtitle(60, 64, 'O coração da Mozilla é sua comunidade pelo mundo');
    VIDEO.addSubtitle(64, 65.8, 'com sua missão compartilhada.');

    VIDEO.addSubtitle(82, 87, 'Muitas pessoas, uma comunidade, uma Mozilla.');
    VIDEO.addSubtitle(87, 90, 'Essa é a chave para o que nôs fará bem-sucedidos');
    VIDEO.addSubtitle(90, 93, 'e ter o máximo de impacto à medida que avançamos');
    VIDEO.addSubtitle(93, 95.8, 'para contruir para uma internet que o mundo precisa.');

    VIDEO.addSubtitle(123.1, 126.5, 'Imagine. Construa. Ensine.');

}, false);