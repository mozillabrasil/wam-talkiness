var socket;
$(document).ready(function () {

    console.log("Opening socket");
    socket = io.connect('/');

    socket.on('connect', function () {
        socket.emit('rtc_init_offerer');
    });
    socket.on('remote_command', function (data) {
        console.log(data);
        processRemoteCommand(data);
    });


    Reveal.initialize({
        width: '100%',
        height: $(window).height(),
        history: true,
        transition: 'concave',
        dependencies: [
            {src: '/js/lib/classList.js', condition: function () {
                    return !document.body.classList;
                }},
            {src: '/js/lib/markdown/marked.js', condition: function () {
                    return !!document.querySelector('[data-markdown]');
                }},
            {src: '/js/lib/markdown/markdown.js', condition: function () {
                    return !!document.querySelector('[data-markdown]');
                }},
            {src: '/js/lib/highlight/highlight.js', async: true, condition: function () {
                    return !!document.querySelector('pre code');
                }, callback: function () {
                    hljs.initHighlightingOnLoad();
                }},
            {src: '/js/lib/zoom-js/zoom.js', async: true},
            {src: '/js/lib/notes/notes.js', async: true}
        ]
    });

});

function processRemoteCommand(data) {
    switch (data.command) {
        case 'start':
            Reveal.slide(0);
            break;
        case 'left':
            Reveal.left();
            break;
        case 'right':
            Reveal.right();
            break;
        case 'up':
            Reveal.up();
            break;
        case 'down':
            Reveal.down();
            break;
        case 'pause':
            Reveal.togglePause();
            break;
        case 'overview':
            Reveal.toggleOverview();
            break;
        case 'scrollToTop':
            var $Scroll = $("section .present code").getNiceScroll(0);
            var $position = $Scroll.getScrollTop();
            $Scroll.doScrollTop(($position - 22), 100);
            break;
        case 'scrollToBottom':
            var $Scroll = $("section .present code").getNiceScroll(0);
            var $position = $Scroll.getScrollTop();
            $Scroll.doScrollTop(($position + 22), 100);
            break;
        case 'scrollToLeft':
            var $Scroll = $("section .present code").getNiceScroll(0);
            var $position = $Scroll.getScrollLeft();
            $Scroll.doScrollLeft(($position - 22), 100);
            break;
        case 'scrollToRight':
            var $Scroll = $("section .present code").getNiceScroll(0);
            var $position = $Scroll.getScrollLeft();
            $Scroll.doScrollLeft(($position + 22), 100);
            break;
        default :
            console.log('Command not found : ' + data);
            break;
    }

}