// chess.js 1.0.0-beta.6
// https://github.com/jhlywa/chess.js

(function() {
  'use strict';

  var Chess = function(fen) {
    this.clear();
    if (fen) this.load(fen);
  };

  Chess.prototype.clear = function() {
    this.board = new Array(128);
    for (var i = 0; i < this.board.length; i++) this.board[i] = null;
    this.kings = { w: EMPTY, b: EMPTY };
    this.turn = 'w';
    this.castling = { w: 0, b: 0 };
    this.ep_square = -1;
    this.half_moves = 0;
    this.move_number = 1;
    this.history = [];
    this.header = {};
    /* this.update_setup(); */
  };

  Chess.prototype.reset = function() {
    this.clear();
    this.load('rnbqkbnr/pppp1ppp/5n2/5p2/5P2/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 2');
  };

  Chess.prototype.load = function(fen) {
    if (typeof fen !== 'undefined') {
      var tokens = fen.split(/\s+/);
      if (!this.validate_fen(fen)) return false;

      // First token is the board position
      var position = tokens[0];
      var square = 0;
      for (var i = 0; i < position.length; i++) {
        var piece = position.charAt(i);
        if (piece === '/') {
          square += 8;
        } else if (is_digit(piece)) {
          square += parseInt(piece, 10);
        } else {
          var color = (piece < 'a') ? 'w' : 'b';
          var p = piece.toLowerCase();
          this.put({ type: p, color: color }, algebraic(square));
          square++;
        }
      }

      this.turn = tokens[1];

      if (tokens[2].indexOf('K') > -1) {
        this.castling.w |= BITS.KSIDE_CASTLE;
      }
      if (tokens[2].indexOf('Q') > -1) {
        this.castling.w |= BITS.QSIDE_CASTLE;
      }
      if (tokens[2].indexOf('k') > -1) {
        this.castling.b |= BITS.KSIDE_CASTLE;
      }
      if (tokens[2].indexOf('q') > -1) {
        this.castling.b |= BITS.QSIDE_CASTLE;
      }

      this.ep_square = (tokens[3] === '-') ? -1 : SQUARE_MAP[tokens[3]];
      this.half_moves = parseInt(tokens[4], 10);
      this.move_number = parseInt(tokens[5], 10);

      this.update_setup();
      return true;
    }
    return false;
  };

  Chess.prototype.validate_fen = function(fen) {
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) return false;

    var position = tokens[0].split('/').reverse();
    if (position.length !== 8) return false;

    for (var i = 0; i < position.length; i++) {
      var row = position[i].replace(/[1-8]/g, '');
      for (var j = 0; j < row.length; j++) {
        if (!/^[prnbqkPRNBQK]$/.test(row.charAt(j))) return false;
      }
      var sum_fields = 0;
      var previous_was_number = false;
      for (var k = 0; k < position[i].length; k++) {
        if (is_digit(position[i].charAt(k))) {
          if (previous_was_number) return false;
          sum_fields += parseInt(position[i].charAt(k), 10);
          previous_was_number = true;
        } else {
          if (previous_was_number) sum_fields++;
          previous_was_number = false;
        }
      }
      if (sum_fields !== 8) return false;
    }

    if (!/^(w|b)$/.test(tokens[1])) return false;
    if (!/^[KQkq-]{1,4}$/.test(tokens[2])) return false;
    if (!(tokens[3] === '-' || /^[a-h][36]$/.test(tokens[3]))) return false;
    if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) return false;
    if (isNaN(tokens[5]) || parseInt(tokens[5], 10) < 1) return false;

    return true;
  };

  Chess.prototype.fen = function() {
    var empty = 0;
    var fen = '';

    for (var i = RANK_8; i >= RANK_1; i--) {
      for (var j = FILE_A; j <= FILE_H; j++) {
        var square = i * 16 + j;
        if (this.board[square] == null) {
          empty++;
        } else {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          var piece = this.board[square];
          fen += (piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase());
        }
      }
      if (empty > 0) {
        fen += empty;
      }

      if (i > RANK_1) fen += '/';
      empty = 0;
    }

    fen += ' ' + this.turn + ' ';
    var c = '';
    if (this.castling.w & BITS.KSIDE_CASTLE) c += 'K';
    if (this.castling.w & BITS.QSIDE_CASTLE) c += 'Q';
    if (this.castling.b & BITS.KSIDE_CASTLE) c += 'k';
    if (this.castling.b & BITS.QSIDE_CASTLE) c += 'q';
    fen += c !== '' ? c : '-';

    if (this.ep_square !== -1) {
      fen += ' ' + algebraic(this.ep_square);
    } else {
      fen += ' -';
    }

    fen += ' ' + this.half_moves + ' ' + this.move_number;

    return fen;
  };

  Chess.prototype.pgn = function(options) {
    var newline = (typeof options === 'object' && typeof options.newline_char === 'string') ? options.newline_char : '\n';
    var max_width = (typeof options === 'object' && typeof options.max_width === 'number') ? options.max_width : 0;
    var result = [];
    var header_exists = false;

    for (var i in this.header) {
      if (this.header.hasOwnProperty(i)) {
        header_exists = true;
        break;
      }
    }

    if (header_exists && !this.header.Result) {
      result.push('[Result "1/2-1/2"]' + newline);
    }

    for (var i in this.header) {
      if (this.header.hasOwnProperty(i)) {
        result.push('[' + i + ' "' + this.header[i] + '"]' + newline);
      }
    }

    if (header_exists && this.header.Result) {
      result.push('[Result "' + this.header.Result + '"]' + newline);
    }

    if (result.length > 0) result.push(newline);

    var moves = [];
    var move_number = 1;
    var move_string = '';

    for (var i = 0; i < this.history.length; i++) {
      var move = this.history[i].move;
      var san = this.move_to_san(move);
      if (this.history[i].color === 'b') {
        move_string = move_number + '. ' + san;
        move_number++;
      } else {
        move_string = san;
      }
      moves.push(move_string);
      if (i + 1 !== this.history.length) moves.push(' ');
    }

    while (moves.length > 0) {
      var chunk = moves.splice(0, 2);
      move_string = chunk.join('');
      if (max_width === 0 || move_string.length <= max_width) {
        result.push(move_string);
        break;
      }
      for (var j = 1; j < chunk.length; j++) {
        if (move_string.slice(0, max_width).lastIndexOf(' ') !== -1 && ((chunk[j].length + move_string.slice(0, max_width).lastIndexOf(' ')) <= max_width)) {
          result.push(move_string.slice(0, move_string.lastIndexOf(' ')));
          move_string = move_string.slice(move_string.lastIndexOf(' ') + 1);
          result.push(newline);
        }
      }
      if (move_string.length > max_width) {
        var k = move_string.lastIndexOf(' ', max_width);
        result.push(move_string.slice(0, k));
        move_string = move_string.slice(k + 1);
        result.push(newline);
      }
      if (move_string.length) result.push(move_string);
      if (moves.length > 0) result.push(' ');
    }

    if (typeof this.header.Result !== 'undefined') {
      result.push(' ' + this.header.Result);
    }
    return result.join('');
  };

  Chess.prototype.header = function() {
    return this.header;
  };

  Chess.prototype.load_pgn = function(pgn, options) {
    // TODO
    return false;
  };

  Chess.prototype.ascii = function() {
    var s = '   +------------------------+\n';
    for (var i = RANK_8; i >= RANK_1; i--) {
      var line = (i + 1) + '  | ';
      for (var j = FILE_A; j <= FILE_H; j++) {
        var piece = this.board[i * 16 + j];
        line += (piece ? piece.type : '.') + ' ';
      }
      s += line + '|\n';
    }
    s += '   +------------------------+\n';
    s += '     a b c d e f g h\n';
    return s;
  };

  Chess.prototype.perft = function(depth) {
    var moves = this.generate_moves({ legal: true });
    var nodes = 0;
    var color = this.turn;

    for (var i = 0; i < moves.length; i++) {
      if (!this.make_move(moves[i])) continue;
      if (depth - 1 > 0) {
        var child_nodes = this.perft(depth - 1);
        nodes += child_nodes;
      }
      this.undo_move();
    }

    this.turn = color;
    return nodes;
  };

  Chess.prototype.square_color = function(square) {
    if (square in SQUARE_MAP) {
      var s = SQUARE_MAP[square];
      return ((s >> 3) + s) % 2 === 0 ? 'light' : 'dark';
    }
    return null;
  };

  Chess.prototype.history = function(options) {
    var reversed_history = [];
    var move_count = 1;
    var position_count = -1;

    if (options) {
      if (options.verbose) {
        while (this.history.length > 0) {
          reversed_history.push(this.undo_move());
          position_count++;
          if (this.history.length % 2 === 0) move_count++;
        }
        while (reversed_history.length > 0) this.make_move(reversed_history.pop());
      }
    }

    return this.history;
  };

  Chess.prototype.get = function(square) {
    return this.board[SQUARE_MAP[square]] || null;
  };

  Chess.prototype.put = function(piece, square) {
    if (typeof piece.type !== 'string' || typeof piece.color !== 'string') return false;

    var sq = SQUARE_MAP[square];
    if (sq === undefined) return false;

    if (piece.type === 'k' && piece.color === 'w') {
      this.kings.w = sq;
    } else if (piece.type === 'k' && piece.color === 'b') {
      this.kings.b = sq;
    }

    this.board[sq] = { type: piece.type, color: piece.color };
    return true;
  };

  Chess.prototype.remove = function(square) {
    var piece = this.get(square);
    var sq = SQUARE_MAP[square];
    if (piece) {
      this.board[sq] = null;
      if (piece.type === 'k' && piece.color === 'w') {
        this.kings.w = EMPTY;
      } else if (piece.type === 'k' && piece.color === 'b') {
        this.kings.b = EMPTY;
      }
    }
    return piece;
  };

  Chess.prototype.generate_moves = function(options) {
    options = options || {};
    var moves = [];
    var us = this.turn;
    var them = us === 'w' ? 'b' : 'w';

    var first_sq = us === 'w' ? RANK_2 : RANK_7;
    var second_sq = us === 'w' ? RANK_4 : RANK_5;

    for (var i = RANK_1; i <= RANK_8; i++) {
      for (var j = FILE_A; j <= FILE_H; j++) {
        var sq = i * 16 + j;
        var piece = this.board[sq];
        if (piece && piece.color === us) {
          if (piece.type === 'p') {
            var add = us === 'w' ? -16 : 16;
            var square = i * 16 + j + add;
            if (this.board[square] === null) {
              add_move(moves, sq, square, BITS.NORMAL);
              if (i === first_sq && this.board[square + add] === null) {
                add_move(moves, sq, square + add, BITS.BIG_PAWN);
              }
            }
            var squares = [j + 1, j - 1].map(function(f) {
              return i * 16 + f + add;
            });
            for (var k = 0; k < squares.length; k++) {
              var to = squares[k];
              if (to & 0x88) continue;
              var captured = this.board[to];
              if (captured && captured.color === them) {
                add_move(moves, sq, to, BITS.CAPTURE);
              } else if (to === this.ep_square) {
                add_move(moves, sq, to, BITS.EP_CAPTURE);
              }
            }
          } else {
            var offsets = {
              n: [-33, -31, -18, -14, 14, 18, 31, 33],
              b: [-17, -15, 15, 17],
              r: [-16, 1, 16, -1],
              q: [-17, -16, -15, 1, 15, 16, 17, -1],
              k: [-17, -16, -15, 1, 15, 16, 17, -1]
            };

            for (var dir in offsets[piece.type]) {
              var n = new AttackDetector(sq);
              while (n.can_find_next(offsets[piece.type][dir])) {
                var to = n.next();
                var captured = this.board[to];
                if (captured) {
                  if (captured.color === them) {
                    add_move(moves, sq, to, BITS.CAPTURE);
                  }
                  break;
                }
                add_move(moves, sq, to, BITS.NORMAL);
                if (piece.type === 'k' && (to - sq) % 2 === 0) break;
              }
            }

            if (piece.type === 'k' && this.can_castle(us)) {
              if (this.castling[us] & BITS.KSIDE_CASTLE) {
                add_move(moves, sq, sq + 2, BITS.KSIDE_CASTLE);
              }
              if (this.castling[us] & BITS.QSIDE_CASTLE) {
                add_move(moves, sq, sq - 2, BITS.QSIDE_CASTLE);
              }
            }
          }
        }
      }
    }

    if (options.legal) {
      var legal_moves = [];
      for (var i = 0; i < moves.length; i++) {
        this.make_move(moves[i]);
        if (!this.in_check()) {
          legal_moves.push(moves[i]);
        }
        this.undo_move();
      }
      return legal_moves;
    }

    return moves;
  };

  Chess.prototype.make_move = function(move) {
    var us = this.turn;
    var them = us === 'w' ? 'b' : 'w';
    var from = SQUARE_MAP[move.from];
    var to = SQUARE_MAP[move.to];

    this.history.push({
      move: move,
      kings: { b: this.kings.b, w: this.kings.w },
      turn: this.turn,
      castling: { b: this.castling.b, w: this.castling.w },
      ep_square: this.ep_square,
      half_moves: this.half_moves,
      move_number: this.move_number
    });

    if (move.flags & BITS.KSIDE_CASTLE) {
      this.board[to + 1] = this.board[from + 3];
      this.board[from + 3] = null;
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      this.board[to - 1] = this.board[from - 4];
      this.board[from - 4] = null;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      if (move.flags & BITS.EP_CAPTURE) {
        this.board[to - us * 16] = null;
      }
      this.board[to] = this.board[from];
      this.board[from] = null;
    } else {
      this.board[to] = this.board[from];
      this.board[from] = null;
    }

    if (move.flags & BITS.PROMOTION) {
      this.board[to] = { type: move.promotion, color: us };
    }

    if (this.board[to].type === 'k') {
      this.kings[us] = to;
      this.castling[us] = 0;
    }

    if (this.castling[us]) {
      for (var i = 0; i < this.history.length; i++) {
        var h = this.history[i];
        if (h.move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
          if (us === 'w') {
            this.castling.w = 0;
          } else {
            this.castling.b = 0;
          }
          break;
        }
        if (h.move.from === from || h.move.to === from) {
          if (piece_at(h, from).type === 'k') {
            this.castling[us] &= ~BITS.KSIDE_CASTLE;
          } else if (piece_at(h, from).type === 'r') {
            if (from - h.move.from === 1 && from % 8 === 0) {
              this.castling[us] &= ~BITS.QSIDE_CASTLE;
            } else if (from - h.move.from === -1 && from % 8 === 7) {
              this.castling[us] &= ~BITS.KSIDE_CASTLE;
            }
          }
        }
        if (h.move.from === to || h.move.to === to) {
          if (piece_at(h, to).type === 'k') {
            this.castling[them] &= ~BITS.KSIDE_CASTLE;
          } else if (piece_at(h, to).type === 'r') {
            if (to - h.move.from === 1 && to % 8 === 0) {
              this.castling[them] &= ~BITS.QSIDE_CASTLE;
            } else if (to - h.move.from === -1 && to % 8 === 7) {
              this.castling[them] &= ~BITS.KSIDE_CASTLE;
            }
          }
        }
      }
    }

    this.ep_square = -1;
    if (move.flags & BITS.BIG_PAWN) {
      this.ep_square = to - (us * 16);
      this.half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      this.half_moves = 0;
    } else {
      this.half_moves++;
    }

    if (them === 'b') {
      this.move_number++;
    }
    this.turn = them;

    return true;
  };

  Chess.prototype.undo_move = function() {
    var old = this.history.pop();
    if (old === undefined) return null;

    var move = old.move;
    this.turn = old.turn;
    this.castling.w = old.castling.w;
    this.castling.b = old.castling.b;
    this.ep_square = old.ep_square;
    this.half_moves = old.half_moves;
    this.move_number = old.move_number;
    this.kings = old.kings;

    var us = this.turn;
    var them = us === 'w' ? 'b' : 'w';

    var from = SQUARE_MAP[move.from];
    var to = SQUARE_MAP[move.to];

    this.board[from] = this.board[to];
    this.board[to] = null;

    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      if (move.flags & BITS.KSIDE_CASTLE) {
        this.board[from + 1] = null;
        this.board[to - 1] = this.board[from + 2];
        this.board[from + 2] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        this.board[from - 1] = null;
        this.board[to + 1] = this.board[from - 2];
        this.board[from - 2] = null;
      }
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      if (move.flags & BITS.EP_CAPTURE) {
        this.board[to - us * 16] = { type: 'p', color: them };
      }
      this.board[to] = old.captured;
    }

    if (move.flags & BITS.PROMOTION) {
      this.board[to] = null;
      this.board[from] = { type: 'p', color: us };
    }

    return move;
  };

  Chess.prototype.in_check = function() {
    var king_pos = this.kings[this.turn];
    var other_color = this.turn === 'w' ? 'b' : 'w';
    var moves = this.generate_moves({ legal: false });

    for (var i = 0; i < moves.length; i++) {
      if (SQUARE_MAP[moves[i].to] === king_pos) return true;
    }

    return false;
  };

  Chess.prototype.in_checkmate = function() {
    return this.in_check() && this.generate_moves().length === 0;
  };

  Chess.prototype.in_stalemate = function() {
    return !this.in_check() && this.generate_moves().length === 0;
  };

  Chess.prototype.insufficient_material = function() {
    var pieces = {};
    var bishops = [];
    var kings = 0;

    for (var i = RANK_1; i <= RANK_8; i++) {
      for (var j = FILE_A; j <= FILE_H; j++) {
        var square = i * 16 + j;
        var piece = this.board[square];
        if (piece) {
          pieces[piece.type] = (pieces[piece.type] || 0) + 1;
          if (piece.type === 'b') {
            bishops.push(square);
          } else if (piece.type === 'k') {
            kings++;
          }
        }
      }
    }

    if (kings < 2) return true;
    else if (pieces['q'] || pieces['r'] || pieces['p'] || (pieces['n'] && pieces['n'] >= 2) || (pieces['b'] && pieces['b'] >= 2)) return false;

    if (pieces['b']) {
      var sum = 0;
      var n = bishops.length;
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          sum += Math.abs((bishops[i] >> 4) - (bishops[j] >> 4)) + Math.abs((bishops[i] & 15) - (bishops[j] & 15));
        }
      }
      if (sum > 2) return false;
    }

    return true;
  };

  Chess.prototype.in_threefold_repetition = function() {
    var moves = [];
    var positions = {};
    var count = 0;

    for (var i = 0; i < this.history.length; i++) {
      var move = this.history[i].move;
      moves.push(this.ascii());
      positions[this.ascii()] = (positions[this.ascii()] || 0) + 1;
      if (positions[this.ascii()] === 3) count++;
    }

    return count >= 1;
  };

  Chess.prototype.game_over = function() {
    return this.in_checkmate() || this.in_stalemate() || this.insufficient_material() || this.in_threefold_repetition();
  };

  Chess.prototype.move_to_san = function(move) {
    return move.san;
  };

  var RANK_1 = 0, RANK_2 = 1, RANK_3 = 2, RANK_4 = 3, RANK_5 = 4, RANK_6 = 5, RANK_7 = 6, RANK_8 = 7;
  var FILE_A = 0, FILE_B = 1, FILE_C = 2, FILE_D = 3, FILE_E = 4, FILE_F = 5, FILE_G = 6, FILE_H = 7;

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  };

  var SQUARE_MAP = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var EMPTY = -1;

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1;
  }

  function algebraic(n) {
    var file = FILE_A + (n & 15);
    var rank = RANK_1 + (n >> 4);
    return 'abcdefgh'.charAt(file) + (rank + 1);
  }

  function piece_at(h, square) {
    return h.board[SQUARE_MAP[square]];
  }

  function add_move(moves, from, to, flags) {
    var move = { from: algebraic(from), to: algebraic(to), flags: flags };
    moves.push(move);
  }

  function AttackDetector(sq) {
    this.sq = sq;
    this.attacked = [];
  }

  AttackDetector.prototype.can_find_next = function(offset) {
    var to = this.sq + offset;
    if (to & 0x88) return false;
    return true;
  };

  AttackDetector.prototype.next = function() {
    var to = this.sq + offset;
    if (to & 0x88) return null;
    this.sq = to;
    return to;
  };

  if (typeof exports !== 'undefined') {
    exports.Chess = Chess;
  } else {
    window.Chess = Chess;
  }
})();
