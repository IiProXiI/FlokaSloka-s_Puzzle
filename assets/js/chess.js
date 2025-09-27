(function() {
  var Chess = function(fen) {
    var BLACK = 'b';
    var WHITE = 'w';
    var EMPTY = -1;

    var PAWN = 'p';
    var KNIGHT = 'n';
    var BISHOP = 'b';
    var ROOK = 'r';
    var QUEEN = 'q';
    var KING = 'k';

    var SYMBOLS = 'pnbrqkPNBRQK';

    var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

    var PAWN_OFFSETS = {
      b: [16, 32, 17, 15],
      w: [-16, -32, -17, -15]
    };

    var PIECE_OFFSETS = {
      n: [-18, -33, -31, -14, 18, 33, 31, 14],
      b: [-17, -15, 17, 15],
      r: [-16, 1, 16, -1],
      q: [-17, -16, -15, 1, 17, 16, 15, -1],
      k: [-17, -16, -15, 1, 17, 16, 15, -1]
    };

    var ATTACKS = [
      20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
      0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
      0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
      0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
      0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
      24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
      0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
      0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
      0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
      0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
      20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
    ];

    var RAYS = [
      17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
      0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
      0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
      0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
      0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
      0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
      0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
      0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
      0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
      -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
    ];

    var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

    var FLAGS = {
      NORMAL: 'n',
      CAPTURE: 'c',
      BIG_PAWN: 'b',
      EP_CAPTURE: 'e',
      PROMOTION: 'p',
      KSIDE_CASTLE: 'k',
      QSIDE_CASTLE: 'q'
    };

    var BITS = {
      NORMAL: 1,
      CAPTURE: 2,
      BIG_PAWN: 4,
      EP_CAPTURE: 8,
      PROMOTION: 16,
      KSIDE_CASTLE: 32,
      QSIDE_CASTLE: 64
    };

    var RANK_1 = 7, RANK_2 = 6, RANK_3 = 5, RANK_4 = 4,
        RANK_5 = 3, RANK_6 = 2, RANK_7 = 1, RANK_8 = 0;

    var SQUARES = {
      a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
      a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
      a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
      a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
      a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
      a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
      a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
      a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };

    var ROOKS = {
      w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
          {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
      b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
          {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
    };

    var KING_CASTLE = [SQUARES.g1, SQUARES.c1, SQUARES.g8, SQUARES.c8];
    var QUEEN_CASTLE = [SQUARES.b1, SQUARES.d1, SQUARES.b8, SQUARES.d8];

    var SQUARE_MAP = {};
    for (var key in SQUARES) {
      SQUARE_MAP[SQUARES[key]] = key;
    }

    var board = new Array(128);
    var kings = {w: EMPTY, b: EMPTY};
    var turn = WHITE;
    var castling = {w: 0, b: 0};
    var ep_square = EMPTY;
    var half_moves = 0;
    var move_number = 1;
    var history = [];
    var header = {};

    if (typeof fen === 'undefined') {
      load(DEFAULT_POSITION);
    } else {
      load(fen);
    }

    function clear() {
      board = new Array(128);
      for (var i = 0; i < 128; i++) {
        board[i] = null;
      }
      kings = {w: EMPTY, b: EMPTY};
      turn = WHITE;
      castling = {w: 0, b: 0};
      ep_square = EMPTY;
      half_moves = 0;
      move_number = 1;
      history = [];
      header = {};
      update_setup(generate_fen());
    }

    function reset() {
      load(DEFAULT_POSITION);
    }

    function load(fen) {
      var tokens = fen.split(/\s+/);
      var position = tokens[0];
      var square = 0;

      if (!valid_fen(fen)) return false;

      clear();

      for (var i = 0; i < position.length; i++) {
        var piece = position.charAt(i);

        if (piece === '/') {
          square += 8;
        } else if (piece >= '1' && piece <= '8') {
          square += parseInt(piece, 10);
        } else {
          var color = (piece < 'a') ? WHITE : BLACK;
          put({type: piece.toLowerCase(), color: color}, SQUARE_MAP[square]);
          square++;
        }
      }

      turn = tokens[1];

      if (tokens[2].indexOf('K') > -1) {
        castling.w |= BITS.KSIDE_CASTLE;
      }
      if (tokens[2].indexOf('Q') > -1) {
        castling.w |= BITS.QSIDE_CASTLE;
      }
      if (tokens[2].indexOf('k') > -1) {
        castling.b |= BITS.KSIDE_CASTLE;
      }
      if (tokens[2].indexOf('q') > -1) {
        castling.b |= BITS.QSIDE_CASTLE;
      }

      ep_square = (tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]]);
      half_moves = parseInt(tokens[4], 10);
      move_number = parseInt(tokens[5], 10);

      update_setup(generate_fen());

      return true;
    }

    function pgn_load(pgn) {
      // TODO
      return false;
    }

    function header_get(k) {
      return header[k];
    }

    function header_set(k, v) {
      header[k] = v;
    }

    function header_clear() {
      header = {};
    }

    function ascii() {
      var s = '   +------------------------+\n';
      for (var i = RANK_8; i >= RANK_1; i--) {
        s += ' ' + (i + 1) + ' |';
        for (var j = 0; j < 8; j++) {
          var square = i * 8 + j;
          if (!board[square]) {
            s += ' . ';
          } else {
            var piece = board[square].type;
            var color = board[square].color;
            var symbol = (color === WHITE) ?
                            piece.toUpperCase() : piece.toLowerCase();
            s += ' ' + symbol + ' ';
          }
        }
        s += '|\n';
      }
      s += '   +------------------------+\n';
      s += '     a  b  c  d  e  f  g  h\n';

      return s;
    }

    function valid_move(move) {
      // move should be a string
      if (typeof move !== 'string') return false;

      // move should be in the form of "e2e4", "f6d5" or "e1g1"
      // (kingside castling) or "e1c1" (queenside castling)
      return move.length === 4 &&
             move[0] >= 'a' && move[0] <= 'h' &&
             move[1] >= '1' && move[1] <= '8' &&
             move[2] >= 'a' && move[2] <= 'h' &&
             move[3] >= '1' && move[3] <= '8' &&
             (move[2] !== move[0] || move[3] !== move[1]);
    }

    function move(move) {
      if (valid_move(move)) {
        var move_obj = make_move({
          from: move.substring(0, 2),
          to: move.substring(2, 4),
          promotion: 'q'
        });
        if (move_obj) {
          history.push(move_obj);
          return move_obj;
        }
      }
      return null;
    }

    function valid_fen(fen) {
      if (typeof fen !== 'string') return false;

      // cut off any move, castling availability, etc
      fen = fen.replace(/ .+$/, '');

      var rows = fen.split('/');
      if (rows.length !== 8) return false;

      for (var i = 0; i < rows.length; i++) {
        var sum_fields = 0;
        var previous_was_number = false;

        for (var k = 0; k < rows[i].length; k++) {
          if (rows[i][k] == ' ') break;
          if (rows[i][k] >= '1' && rows[i][k] <= '8') {
            sum_fields += parseInt(rows[i][k], 10);
            previous_was_number = true;
          } else {
            if (!previous_was_number) return false;
            sum_fields += 1;
            previous_was_number = false;
          }
        }
        if (sum_fields !== 8) return false;
      }

      return true;
    }

    function set_header(args) {
      for (var i = 0; i < args.length; i += 2) {
        if (typeof args[i] === 'string' &&
            typeof args[i + 1] === 'string') {
          header[args[i]] = args[i + 1];
        }
      }
      return header;
    }

    function update_setup(fen) {
      if (history.length > 0) return;

      if (fen !== DEFAULT_POSITION) {
        header['SetUp'] = '1';
        header['FEN'] = fen;
      }
    }

    function get(square) {
      var piece = board[SQUARES[square]];
      return (piece) ? {type: piece.type, color: piece.color} : null;
    }

    function put(piece, square) {
      if (!('type' in piece && 'color' in piece)) return false;
      if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) return false;
      if (!(square in SQUARES)) return false;

      var sq = SQUARES[square];

      board[sq] = {type: piece.type.toLowerCase(), color: piece.color};
      if (piece.type == KING) {
        kings[piece.color] = sq;
      }

      update_setup(generate_fen());

      return true;
    }

    function remove(square) {
      if (!(square in SQUARES)) return null;

      var piece = get(square);
      board[SQUARES[square]] = null;
      if (piece && piece.type === KING) {
        kings[piece.color] = EMPTY;
      }

      update_setup(generate_fen());

      return piece;
    }

    function build_move(from, to, flags, promotion) {
      var move = {
        from: from,
        to: to,
        flags: flags
      };
      if (promotion) {
        move.promotion = promotion;
      }
      return move;
    }

    function generate_moves(options) {
      function add_move(board, from, to, flags) {
        var move = build_move(from, to, flags);
        moves.push(move);
      }

      var moves = [];
      var us = turn;
      var them = us === WHITE ? BLACK : WHITE;

      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (i & 0x88) { i += 7; continue; }

        var piece = board[i];
        if (piece == null || piece.color !== us) {
          continue;
        }

        var from = SQUARE_MAP[i];

        var offsets;
        if (piece.type === PAWN) {
          offsets = PAWN_OFFSETS[piece.color];
          var is_ep = false;

          for (var j = 0; j < offsets.length; j++) {
            var offset = offsets[j];
            var to = i + offset;

            if (to & 0x88) continue;

            if (offset > 0) {
              if (piece.color === WHITE) continue;
            } else {
              if (piece.color === BLACK) continue;
            }

            if (board[to]) {
              continue;
            }

            if (Math.abs(offset) > 16 && !(i + offset / 2 & 0x88) &&
                board[i + offset / 2] &&
                board[i + offset / 2].type === PAWN &&
                board[i + offset / 2].color === us) {
              add_move(board, from, SQUARE_MAP[to], BITS.BIG_PAWN);
            } else if (Math.abs(offset) === 16 &&
                       rank(i) === RANK_2[piece.color] &&
                       !board[i + offset / 2]) {
              add_move(board, from, SQUARE_MAP[to], BITS.BIG_PAWN);
              add_move(board, from, SQUARE_MAP[to], BITS.NORMAL);
            } else {
              add_move(board, from, SQUARE_MAP[to], BITS.NORMAL);
            }
          }

          /* pawn captures */
          for (j = 2; j < 4; j++) {
            to = i + PAWN_OFFSETS[piece.color][j];
            if (to & 0x88) continue;

            if (board[to] && board[to].color === them) {
              add_move(board, from, SQUARE_MAP[to], BITS.CAPTURE);
            } else if (to === ep_square) {
              add_move(board, from, SQUARE_MAP[to], BITS.EP_CAPTURE);
            }
          }
        } else {
          offsets = PIECE_OFFSETS[piece.type];

          for (var j = 0; j < offsets.length; j++) {
            var offset = offsets[j];
            var to = i;

            while (true) {
              to += offset;

              if (to & 0x88) break;

              if (!board[to]) {
                add_move(board, from, SQUARE_MAP[to], BITS.NORMAL);
              } else {
                if (board[to].color === us) break;
                add_move(board, from, SQUARE_MAP[to], BITS.CAPTURE);
                break;
              }

              if (piece.type === 'n' || piece.type === 'k') break;
            }
          }
        }
      }

      /* castling moves */
      if (castling[us] !== 0) {
        if (castling[us] & BITS.KSIDE_CASTLE) {
          var king_to = us === WHITE ? SQUARES.g1 : SQUARES.g8;
          if (!board[king_to] && !board[king_to - 1] &&
              !attacked(them, us === WHITE ? SQUARES.e1 : SQUARES.e8) &&
              !attacked(them, king_to - 1)) {
            add_move(board, us === WHITE ? 'e1' : 'e8',
                     us === WHITE ? 'g1' : 'g8', BITS.KSIDE_CASTLE);
          }
        }

        if (castling[us] & BITS.QSIDE_CASTLE) {
          var king_to = us === WHITE ? SQUARES.c1 : SQUARES.c8;
          if (!board[king_to] && !board[king_to + 1] && !board[king_to + 2] &&
              !attacked(them, us === WHITE ? SQUARES.e1 : SQUARES.e8) &&
              !attacked(them, king_to + 1)) {
            add_move(board, us === WHITE ? 'e1' : 'e8',
                     us === WHITE ? 'c1' : 'c8', BITS.QSIDE_CASTLE);
          }
        }
      }

      if (options && options.legal) {
        var legal_moves = [];
        for (i = 0; i < moves.length; i++) {
          if (make_move(moves[i]).in_check === false) {
            legal_moves.push(moves[i]);
          } else {
            undo_move();
          }
        }
        return legal_moves;
      }

      return moves;
    }

    function move_to_san(move) {
      var moves = generate_moves();
      for (var i = 0; i < moves.length; i++) {
        if (move_to_lan(moves[i]) === move_to_lan(move)) {
          return move_to_lan(moves[i]);
        }
      }
      return null;
    }

    function move_to_lan(move) {
      var flags = '';

      if (move.flags & BITS.KSIDE_CASTLE) {
        return 'O-O';
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        return 'O-O-O';
      }

      if (move.flags & BITS.CAPTURE) {
        flags = 'x';
      } else if (move.flags & (BITS.EP_CAPTURE)) {
        flags = 'e.p.';
      }

      if (move.promotion) {
        flags += '=' + move.promotion.toUpperCase();
      }

      return SQUARE_MAP[move.from] + flags + SQUARE_MAP[move.to];
    }

    function make_move(move) {
      var us = turn;
      var them = us === WHITE ? BLACK : WHITE;
      var from = SQUARES[move.from];
      var to = SQUARES[move.to];
      var king;

      var flags = move.flags;
      var captured = get(move.to);

      var move_obj = {
        move: move,
        captured: captured
      };

      if (flags & BITS.KSIDE_CASTLE) {
        king = board[from];
        board[from] = null;
        board[to] = king;
        kings[us] = to;

        var rook_from = SQUARES[us === WHITE ? 'h1' : 'h8'];
        var rook_to = SQUARES[us === WHITE ? 'f1' : 'f8'];
        board[rook_from] = null;
        board[rook_to] = board[rook_to + 1];
        board[rook_to + 1] = null;
      } else if (flags & BITS.QSIDE_CASTLE) {
        king = board[from];
        board[from] = null;
        board[to] = king;
        kings[us] = to;

        var rook_from = SQUARES[us === WHITE ? 'a1' : 'a8'];
        var rook_to = SQUARES[us === WHITE ? 'd1' : 'd8'];
        board[rook_from] = null;
        board[rook_to] = board[rook_to - 2];
        board[rook_to - 2] = null;
      } else {
        if (flags & BITS.EP_CAPTURE) {
          board[to - PAWN_OFFSETS[us][0]] = null;
        }

        if (move.promotion) {
          board[to] = {type: move.promotion.toLowerCase(), color: us};
        } else {
          var piece = board[from];
          board[from] = null;
          board[to] = piece;
        }

        if (board[to].type === KING) {
          kings[us] = to;
          castling[us] = 0;
        }
      }

      if (board[to].type === ROOK) {
        if (us === WHITE) {
          if (from === SQUARES.a1) castling.w &= ~BITS.QSIDE_CASTLE;
          if (from === SQUARES.h1) castling.w &= ~BITS.KSIDE_CASTLE;
        } else {
          if (from === SQUARES.a8) castling.b &= ~BITS.QSIDE_CASTLE;
          if (from === SQUARES.h8) castling.b &= ~BITS.KSIDE_CASTLE;
        }
      }

      if (flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
        if (us === WHITE) {
          castling.w = 0;
        } else {
          castling.b = 0;
        }
      }

      ep_square = (flags & BITS.EP_CAPTURE) ? from : EMPTY;

      if (flags & BITS.BIG_PAWN) {
        if (us === WHITE) {
          ep_square = from - 16;
        } else {
          ep_square = from + 16;
        }
      }

      if (flags & BITS.CAPTURE) {
        half_moves = 0;
      } else if (flags & BITS.NORMAL) {
        half_moves++;
      }

      if (us === BLACK) {
        move_number++;
      }
      turn = them;

      update_setup(generate_fen());

      move_obj.fen = generate_fen();
      return move_obj;
    }

    function undo_move() {
      var move = history.pop();
      if (move === undefined) {
        return null;
      }

      var us = turn;
      var them = us === WHITE ? BLACK : WHITE;

      var move_obj = move.move;
      var from = SQUARES[move_obj.from];
      var to = SQUARES[move_obj.to];

      board[from] = board[to];
      board[board[from].color === WHITE ? kings.w : kings.b] = from;
      board[to] = move_obj.captured;

      if (move_obj.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
        var king_to = from;
        var king_from = to;

        board[king_from] = board[king_to];
        board[king_to] = null;
        kings[us] = king_from;

        var rook_from, rook_to;
        if (move_obj.flags & BITS.KSIDE_CASTLE) {
          rook_from = SQUARES[us === WHITE ? 'h1' : 'h8'];
          rook_to = SQUARES[us === WHITE ? 'f1' : 'f8'];
        } else {
          rook_from = SQUARES[us === WHITE ? 'a1' : 'a8'];
          rook_to = SQUARES[us === WHITE ? 'd1' : 'd8'];
        }

        board[rook_from] = board[rook_to];
        board[rook_to] = null;
      } else {
        if (move_obj.flags & BITS.EP_CAPTURE) {
          board[to + PAWN_OFFSETS[us][0]] = {type: PAWN, color: them};
        }

        if (move_obj.promotion) {
          board[to] = {type: PAWN, color: us};
        }
      }

      turn = move_obj.captured ? us : them;
      if (move_obj.captured) {
        move_number--;
      }

      castling.w = move.castling.w;
      castling.b = move.castling.b;
      ep_square = move.ep_square;
      half_moves = move.half_moves;
      move_number = move.move_number;

      update_setup(generate_fen());

      return move_obj;
    }

    function attacked(color, square) {
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (i & 0x88) { i += 7; continue; }

        var piece = board[i];
        if (piece && piece.color === color) {
          var difference = i - square;
          var index = difference + 119;

          if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
            if (piece.type === PAWN) {
              if (difference > 0) {
                if (piece.color === WHITE) return true;
              } else {
                if (piece.color === BLACK) return true;
              }
              continue;
            }

            /* if the piece is a knight or a king */
            if (piece.type === 'n' || piece.type === 'k') return true;

            var offset = RAYS[index];
            var j = i + offset;

            var blocked = false;
            while (j !== square) {
              if (board[j]) { blocked = true; break; }
              j += offset;
            }

            if (!blocked) return true;
          }
        }
      }

      return false;
    }

    function in_check() {
      return attacked(turn === WHITE ? BLACK : WHITE, kings[turn]);
    }

    function in_checkmate() {
      return in_check() && generate_moves().length === 0;
    }

    function in_stalemate() {
      return !in_check() && generate_moves().length === 0;
    }

    function insufficient_material() {
      var pieces = {};
      var bishops = [];
      var num_pieces = 0;
      var sq_color = 0;

      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        sq_color = (sq_color + 1) % 2;
        if (i & 0x88) { i += 7; continue; }

        var piece = board[i];
        if (piece) {
          pieces[piece.type] = (piece.type in pieces) ?
                              pieces[piece.type] + 1 : 1;
          if (piece.type === BISHOP) {
            bishops.push(sq_color);
          }
          num_pieces++;
        }
      }

      if (num_pieces === 2) return true;
      else if (num_pieces === 3 && (pieces[KNIGHT] === 1 ||
                                    pieces[BISHOP] === 1)) return true;
      else if (num_pieces === pieces[BISHOP] + 2) {
        var sum = 0;
        var len = bishops.length;
        for (var i = 0; i < len; i++) {
          sum += bishops[i];
        }
        if (sum === 0 || sum === len) return true;
      }
      return false;
    }

    function in_threefold_repetition() {
      var moves = [];
      var positions = {};
      var fen;

      for (var i = 0; i < history.length; i++) {
        fen = generate_fen();
        positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
        if (positions[fen] >= 3) {
          return true;
        }
      }

      return false;
    }

    function push(move) {
      history.push(make_move(move));
    }

    function get_fen() {
      return generate_fen();
    }

    function generate_fen() {
      var empty = 0;
      var fen = '';

      for (var i = RANK_8; i >= RANK_1; i--) {
        for (var j = 0; j < 8; j++) {
          var square = i * 8 + j;
          if (!board[square]) {
            empty++;
          } else {
            if (empty > 0) {
              fen += empty;
              empty = 0;
            }
            var color = board[square].color;
            var piece = board[square].type;

            var symbol = (color === WHITE) ?
                         piece.toUpperCase() : piece.toLowerCase();
            fen += symbol;
          }
        }
        if (empty > 0) {
          fen += empty;
        }

        if (i > 0) {
          fen += '/';
        }
        empty = 0;
      }

      fen += ' ' + turn + ' ';
      fen += castling[WHITE] || castling[BLACK] ? '' : '-';
      if (castling[WHITE]) {
        if (castling[WHITE] & BITS.KSIDE_CASTLE) fen += 'K';
        if (castling[WHITE] & BITS.QSIDE_CASTLE) fen += 'Q';
      }
      if (castling[BLACK]) {
        if (castling[BLACK] & BITS.KSIDE_CASTLE) fen += 'k';
        if (castling[BLACK] & BITS.QSIDE_CASTLE) fen += 'q';
      }
      fen += ' ';
      fen += ep_square === EMPTY ? '-' : SQUARE_MAP[ep_square];
      fen += ' ' + half_moves + ' ' + move_number;

      return fen;
    }

    function set_turn(color) {
      turn = color;
    }

    function get_turn() {
      return turn;
    }

    function set_castling(color, flags) {
      castling[color] = flags;
    }

    function set_ep_square(square) {
      ep_square = square;
    }

    function set_move_number(n) {
      move_number = n;
    }

    function in_draw() {
      return half_moves >= 100 ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
    }

    function game_over() {
      return in_checkmate() || in_draw();
    }

    /* this probably shouldn't exist */
    function perft(depth) {
      var moves = generate_moves({legal: true});
      var nodes = 0;
      var color = turn;

      if (depth === 0) return 1;

      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        if (make_move(move)) {
          nodes += perft(depth - 1);
        }
        undo_move();
      }

      return nodes;
    }

    return {
      load: load,
      pgn_load: pgn_load,
      header_get: header_get,
      header_set: header_set,
      header_clear: header_clear,
      ascii: ascii,
      move: move,
      undo: undo_move,
      moves: generate_moves,
      in_check: in_check,
      in_checkmate: in_checkmate,
      in_stalemate: in_stalemate,
      in_draw: in_draw,
      game_over: game_over,
      validate_fen: valid_fen,
      fen: get_fen,
      pgn: function() { return ''; }, // Simplified
      turn: get_turn,
      put: put,
      get: get,
      remove: remove,
      perft: perft,
      board: board,
      history: history,
      clear: clear,
      reset: reset,
      load_pgn: pgn_load, /* alias */
      set_header: set_header,
      update_setup: update_setup,
      set_turn: set_turn,
      set_castling: set_castling,
      set_ep_square: set_ep_square,
      set_move_number: set_move_number
    };
  };

  if (typeof window !== 'undefined') window.Chess = Chess;
})();
