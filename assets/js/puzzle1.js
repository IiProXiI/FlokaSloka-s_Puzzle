(function() {
  var board = null;
  var game = new Chess();
  var $status = $('#status');
  var $codeBox = $('#codeBox');
  var $codeText = $('#theCode');

  // تحقق من وجود jQuery
  if (typeof window.jQuery === 'undefined') {
    console.error('jQuery is not loaded! Please check the script order in HTML.');
    return;
  }

  var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
  };

  var greySquare = function(square) {
    var $square = $('#board .square-' + square);
    var background = '#a9a9a9';
    if ($square.hasClass('black-3c85d') === true) {
      background = '#696969';
    }
    $square.css('background', background);
  };

  var onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true || 
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  var onDrop = function(source, target) {
    removeGreySquares();

    var move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) return 'snapback';

    updateStatus();
    window.setTimeout(makeRandomMove, 250);
  };

  var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
      square: square,
      verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  };

  var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
  };

  var onSnapEnd = function() {
    board.position(game.fen());
  };

  var updateStatus = function() {
    var status = '';
    var moveColor = 'White';

    if (game.in_checkmate() === true) {
      status = 'فزت! الرمز: C1-9QX7';
      $codeBox.show();
      $codeText.text('C1-9QX7');
      GameProgress.markSolved('p1');
    } else if (game.in_draw() === true) {
      status = 'تعادل. حاول مرة أخرى.';
    } else {
      status = moveColor + ' to move';

      if (game.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
      }
    }

    $status.html(status);
  };

  var makeRandomMove = function() {
    var possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;

    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
    updateStatus();
  };

  var cfg = {
    draggable: true,
    position: 'start',
    pieceTheme: 'https://chessboardjs.com/chesspieces/wikipedia/{piece}.png',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
  };
  board = Chessboard('board', cfg);
  updateStatus();
})();
