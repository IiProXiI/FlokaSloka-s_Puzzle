// chess.js 1.0.0-beta.6
// https://github.com/jhlywa/chess.js

(function() {
  'use strict';

  var Chess = function(fen) {
    this.clear();
    this.load(fen);
  };

  Chess.prototype.clear = function() {
    this.board = Array(64).fill(null);
    this.kings = { w: null, b: null };
    this.turn = 'w';
    this.castling = { w: { K: true, Q: true }, b: { K: true, Q: true } };
    this.enpassant = null;
    this.halfmoves = 0;
    this.fullmoves = 1;
    this.history = [];
    this.header = {};
  };

  Chess.prototype.load = function(fen) {
    if (typeof fen !== 'string') {
      this.clear();
      return this;
    }

    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;

    if (this.validateFen(fen) !== true) {
      return false;
    }

    this.clear();

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8 - (square % 8);
        continue;
      }

      if (/\d/.test(piece)) {
        square += parseInt(piece, 10);
      } else {
        var col = square % 8;
        var row = 7 - Math.floor(square / 8);
        this.board[square] = piece;
        this.putPiece(piece, row, col);
        square++;
      }
    }

    this.turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      this.castling.w.K = true;
    }
    if (tokens[2].indexOf('Q') > -1) {
      this.castling.w.Q = true;
    }
    if (tokens[2].indexOf('k') > -1) {
      this.castling.b.K = true;
    }
    if (tokens[2].indexOf('q') > - -1) {
      this.castling.b.Q = true;
    }

    this.enpassant = tokens[3];

    if (tokens[4]) {
      this.halfmoves = parseInt(tokens[4], 10);
    }
    if (tokens[5]) {
      this.fullmoves = parseInt(tokens[5], 10);
    }

    return this;
  };

  Chess.prototype.validateFen = function(fen) {
    var rank = 0;
    var file = 0;
    var rowSum = 0;

    for (var i = 0; i < fen.length; i++) {
      var tempChar = fen.charAt(i);

      if (tempChar === ' ') {
        rank++;
        file = 0;
        continue;
      }

      if (rank === 0) {
        if (file === 8) {
          return false;
        }
        if (isNaN(tempChar)) {
          if (rowSum > 16) {
            return false;
          }
          rowSum++;
          file++;
        } else {
          file += parseInt(tempChar, 10);
        }
        if (file > 8) {
          return false;
        }
      } else if (rank === 1) {
        if (tempChar.search(/^[bw-]$/) === -1) {
          return false;
        }
      } else if (rank === 2) {
        if (tempChar.search(/^[kqKQkq-]{1,4}$/) === -1) {
          return false;
        }
      } else if (rank === 3) {
        if (tempChar !== '-') {
          if (tempChar.search(/^[a-h][36]$/) === -1) {
            return false;
          }
        }
      } else if (rank === 4) {
        if (isNaN(tempChar)) {
          return false;
        }
      } else if (rank === 5) {
        if (isNaN(tempChar)) {
          return false;
        }
      } else {
        return false;
      }
    }

    if (rank !== 5) {
      return false;
    }

    return true;
  };

  Chess.prototype.fen = function() {
    var empty = 0;
    var fen = '';

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (this.board[i * 8 + j] === null) {
          empty++;
        } else {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += this.board[i * 8 + j];
        }
      }

      if (empty > 0) {
        fen += empty;
        empty = 0;
      }

      if (i !== 7) {
        fen += '/';
      }
    }

    fen += ' ' + this.turn + ' ';

    var castling = '';
    if (this.castling.w.K) castling += 'K';
    if (this.castling.w.Q) castling += 'Q';
    if (this.castling.b.K) castling += 'k';
    if (this.castling.b.Q) castling += 'q';
    fen += castling || '-';

    fen += ' ' + (this.enpassant || '-');

    fen += ' ' + this.halfmoves + ' ' + this.fullmoves;

    return fen;
  };

  Chess.prototype.putPiece = function(piece, row, col) {
    if (piece.toLowerCase() === 'k') {
      this.kings[piece === 'k' ? 'b' : 'w'] = row * 8 + col;
    }
  };

  Chess.prototype.move = function(move, sloppy) {
    var us = this.turn;
    var them = this.turn === 'w' ? 'b' : 'w';
    var from = this.algebraic(move.from);
    var to = this.algebraic(move.to);
    var promotion = move.promotion ? move.promotion.toLowerCase() : null;

    if (this.validateMove(move, sloppy) !== true) {
      return null;
    }

    this.board[from] = null;
    this.board[to] = promotion || move.piece;

    if (move.flags & this.BITS.KINGSIDE_CASTLE) {
      if (us === 'w') {
        this.board[this.square('h1')] = null;
        this.board[this.square('f1')] = this.board[this.square('g1')];
        this.board[this.square('g1')] = null;
      } else {
        this.board[this.square('h8')] = null;
        this.board[this.square('f8')] = this.board[this.square('g8')];
        this.board[this.square('g8')] = null;
      }
    } else if (move.flags & this.BITS.QUEENSIDE_CASTLE) {
      if (us === 'w') {
        this.board[this.square('a1')] = null;
        this.board[this.square('d1')] = this.board[this.square('c1')];
        this.board[this.square('c1')] = null;
      } else {
        this.board[this.square('a8')] = null;
        this.board[this.square('d8')] = this.board[this.square('c8')];
        this.board[this.square('c8')] = null;
      }
    }

    if (move.flags & this.BITS.EN_PASSANT) {
      var epSquare = (move.to.charCodeAt(0) - 'a'.charCodeAt(0)) + 8 * (move.to.charCodeAt(1) - '1'.charCodeAt(0));
      this.board[epSquare] = null;
    }

    if (move.flags & (this.BITS.KINGSIDE_CASTLE | this.BITS.QUEENSIDE_CASTLE)) {
      this.castling[us].K = false;
      this.castling[us].Q = false;
      this.castling[them].K = false;
      this.castling[them].Q = false;
    } else {
      var castleFrom = move.from.charCodeAt(0) - 'a'.charCodeAt(0);
      var castleTo = move.to.charCodeAt(0) - 'a'.charCodeAt(0);
      if (move.piece === 'K') {
        this.castling[us].K = false;
      } else if (move.piece === 'Q') {
        this.castling[us].Q = false;
      } else if (move.from === 'h1' || move.from === 'h8') {
        this.castling[us].K = false;
      } else if (move.from === 'a1' || move.from === 'a8') {
        this.castling[us].Q = false;
      }
    }

    this.turn = them;

    if (promotion) {
      this.board[to] = promotion;
    }

    this.halfmoves = (move.flags & (this.BITS.CAPTURE | this.BITS.PROMOTION)) ? 0 : this.halfmoves + 1;
    this.fullmoves = (us !== 'w') ? this.fullmoves + 1 : this.fullmoves;

    this.history.push({
      move: move,
      kings: { b: this.kings.b, w: this.kings.w },
      turn: this.turn,
      castling: { b: this.castling.b, w: this.castling.w },
      enpassant: this.enpassant,
      halfmoves: this.halfmoves,
      fullmoves: this.fullmoves
    });

    this.enpassant = null;

    return move;
  };

  Chess.prototype.ascii = function() {
    var s = '   +------------------------+\n';
    for (var i = 0; i < 8; i++) {
      var line = String(8 - i) + ' |';
      for (var j = 0; j < 8; j++) {
        line += ' ' + (this.board[i * 8 + j] || '.') + ' |';
      }
      s += line + '\n';
    }
    s += '   +------------------------+\n';
    s += '     a b c d e f g h\n';
    return s;
  };

  Chess.prototype.perft = function(depth) {
    var moves = this.generateMoves({ verbose: true });
    var nodes = 0;
    var color = this.turn;

    for (var i = 0; i < moves.length; i++) {
      this.move(moves[i]);
      if (depth - 1 > 0) {
        var childNodes = this.perft(depth - 1);
        nodes += childNodes;
      }
      this.undo();
    }

    this.turn = color;
    return nodes;
  };

  Chess.prototype.squareColor = function(square) {
    if (typeof square !== 'string') {
      return null;
    }

    var row = 8 - (square.charCodeAt(1) - '1'.charCodeAt(0));
    var col = square.charCodeAt(0) - 'a'.charCodeAt(0);

    return ((row + col) % 2 === 0) ? 'light' : 'dark';
  };

  Chess.prototype.squareToIndex = function(square) {
    if (typeof square !== 'string') {
      return -1;
    }

    var row = 8 - (square.charCodeAt(1) - '1'.charCodeAt(0));
    var col = square.charCodeAt(0) - 'a'.charCodeAt(0);

    return row * 8 + col;
  };

  Chess.prototype.indexToSquare = function(index) {
    if (index < 0 || index > 63) {
      return null;
    }

    var row = 7 - Math.floor(index / 8);
    var col = index % 8;

    return String.fromCharCode('a'.charCodeAt(0) + col) + (row + 1);
  };

  Chess.prototype.get = function(square) {
    if (typeof square !== 'string') {
      return null;
    }

    var index = this.squareToIndex(square);
    if (index === -1) {
      return null;
    }

    return this.board[index];
  };

  Chess.prototype.remove = function(square) {
    var piece = this.get(square);
    if (piece) {
      this.board[this.squareToIndex(square)] = null;
    }
    return piece;
  };

  Chess.prototype.put = function(piece, square) {
    if (this.get(square) !== null) {
      return false;
    }

    this.board[this.squareToIndex(square)] = piece;
    return true;
  };

  Chess.prototype.generateMoves = function(options) {
    options = options || {};

    var moves = [];
    var us = this.turn;
    var them = this.turn === 'w' ? 'b' : 'w';

    var secondRank = { w: 1, b: 6 };

    for (var i = 0; i < 64; i++) {
      var from = this.indexToSquare(i);
      var piece = this.board[i];

      if (piece === null) {
        continue;
      }

      if (piece.color() !== us) {
        continue;
      }

      if (piece.type === 'p') {
        var direction = (us === 'w') ? -1 : 1;
        var startRow = secondRank[us];
        var currentRow = 8 - Math.floor(i / 8);

        if (this.get(from[0] + String.fromCharCode(from.charCodeAt(1) + direction)) === null) {
          if (currentRow === startRow) {
            var move = { from: from, to: from[0] + String.fromCharCode(from.charCodeAt(1) + 2 * direction), flags: this.BITS.PAWN_DOUBLE_STEP };
            moves.push(move);
          }

          var normalMove = { from: from, to: from[0] + String.fromCharCode(from.charCodeAt(1) + direction), flags: this.BITS.NORMAL };
          moves.push(normalMove);
        }

        var possibles = [1, -1].map(function(d) {
          return from[0] + String.fromCharCode(from.charCodeAt(0) + d) + String.fromCharCode(from.charCodeAt(1) + direction);
        });

        for (var j = 0; j < possibles.length; j++) {
          var to = possibles[j];
          var capturedPiece = this.get(to);

          if (capturedPiece && capturedPiece.color() === them) {
            var move = { from: from, to: to, flags: this.BITS.CAPTURE };
            moves.push(move);
          }
        }

        if (this.enpassant) {
          var epSquare = this.enpassant;
          var epDirection = Math.sign(String
