// Esperar a que el DOM esté completamente cargado antes de ejecutar código
document.addEventListener('DOMContentLoaded', () => {
    let tablero = null; // Inicializar el tablero de ajedrez
    const juego = new Chess(); // Crear nueva instancia de juego Chess.js
    const moverHistorial = document.getElementById('mover-historial'); // Obtener el historial de movimientos del contenedor
    let moverRecuento = 1; // Inicializar el recuento de movimientos
    let colorUsuario = 'w'; // Inicializar el color del usuario como blanco

    // Función para realizar un movimiento aleatorio
    const makeRandomMove = () => {
        const possibleMoves = juego.moves();

        if (juego.game_over()) {
            alert("Jaque mate!");
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            juego.move(move);
            tablero.position(juego.fen());
            recordMove(move, moverRecuento); // Registrar y mostrar el movimiento con el recuento de movimientos
            moverRecuento++; // Incrementar el recuento de movimientos
        }
    };

    // Función para registrar y mostrar un movimiento en el historial de movimientos
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moverHistorial.textContent += formattedMove + ' ';
        moverHistorial.scrollTop = moverHistorial.scrollHeight; // Desplazamiento automático al último movimiento
    };

    // Función para manejar el inicio de una posición de arrastre
    const onDragStart = (source, piece) => {
        // Permitir al usuario arrastrar sólo sus propias piezas en función del color
        return !juego.game_over() && piece.search(colorUsuario) === 0;
    };

    // Función para gestionar la caída de una ficha en el tablero
    const onDrop = (source, target) => {
        const move = juego.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moverRecuento); // Registrar y mostrar el movimiento con el recuento de movimientos
        moverRecuento++;
    };

    // Función para manejar el final de la animación de una pieza snap
    const onSnapEnd = () => {
        tablero.position(juego.fen());
    };

    // Opciones de configuración del tablero de ajedrez
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    // Inicializar el tablero de ajedrez
    tablero = Chessboard('tablero', boardConfig);

    // Event listener for the "Play Again" button
    document.querySelector('.play-again').addEventListener('click', () => {
        juego.reset();
        tablero.start();
        moverHistorial.textContent = '';
        moverRecuento = 1;
        colorUsuario = 'w';
    });

    // Event listener for the "Set Position" button
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Introduzca la notación FEN para la posición deseada.");
        if (fen !== null) {
            if (juego.load(fen)) {
                tablero.position(fen);
                moverHistorial.textContent = '';
                moverRecuento = 1;
                colorUsuario = 'w';
            } else {
                alert("Notación FEN no válida. Inténtelo de nuevo.");
            }
        }
    });

    // Event listener for the "Flip Board" button
    document.querySelector('.flip-board').addEventListener('click', () => {
        tablero.flip();
        makeRandomMove();
        // Toggle user's color after flipping the board
        colorUsuario = colorUsuario === 'w' ? 'b' : 'w';
    });

});