/**
 * Module: chess.js
 * Version: 0.12.0
 * Author: Jeff Hlywa
 * License: MIT
 */

(function() {

  'use strict';

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

  var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1';

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14,  18, 33,  31,  14],
    b: [-17, -15,  17,  15],
    r: [-16,   1,  16,  -1],
    q: [-17, -16, -15,   1,  17, 16,  15,  -1],
    k: [-17, -16, -15,   1,  17, 16,  15,  -1]
  };

  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0,  0,  0,  0, 20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0,  0,  0, 20,  0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0,  0, 20,  0,  0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0, 20,  0,  0,  0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0, 20,  0,  0,  0,  0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2, 20,  0,  0,  0,  0,  0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53,  2,  0,  0,  0,  0,  0, 0,
    24,24,24,24,24,24,56,  0, 56, 24, 24, 24, 24, 24, 24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53,  2,  0,  0,  0,  0,  0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2, 20,  0,  0,  0,  0,  0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0,  0, 20,  0,  0,  0,  0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0,  0,  0, 20,  0,  0,  0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0,  0,  0,  0, 20,  0,  0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0,  0,  0,  0,  0, 20,  0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0,  0,  0,  0,  0, 20
  ];

  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
     1,   1,  1,  1,  1,  1,  1,  0, -1, -1,  -1, -1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0, -15, -16, -17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, -15,  0, -16,  0, -17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0, -15,  0,  0, -16,  0,  0, -17,  0,  0,  0,  0, 0,
      0,  0,  0, -15,  0,  0,  0, -16,  0,  0,  0, -17,  0,  0,  0, 0,
      0,  0, -15,  0,  0,  0,  0, -16,  0,  0,  0,  0, -17,  0,  0, 0,
      0, -15,  0,  0,  0,  0,  0, -16,  0,  0,  0,  0,  0, -17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0, -16,  0,  0,  0,  0,  0,  0, -17
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

  var RANK_1 = 7, RANK_2 = 6, RANK_3 = 5, RANK_4 = 4, RANK_5 = 3, RANK_6 = 2, RANK_7 = 1, RANK_8 = 0;

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

  function assert(condition, message) {
    if (!condition) {
      console.assert(condition, message || 'Assertion failed');
    }
  }

  function validMove(move) {
    // move should be a string
    if (typeof move !== 'string') return false;

    // move should be in the form of "e2e4", "f6d5" or "e1g1" (kingside castling)
    // the second character should not be 'x'
    return move.length === 4 &&
           move[0] >= 'a' && move[0] <= 'h' &&
           move[1] >= '1' && move[1] <= '8' &&
           move[2] >= 'a' && move[2] <= 'h' &&
           move[3] >= '1' && move[3] <= '8' &&
           move.indexOf('x') === -1;
  }

  function validFen(fen) {
    if (typeof fen !== 'string') return false;

    // Cut off any move, castling availability, etc. with space
    fen = fen.replace(/ .+$/, '');

    var rows = fen.split('/');
    if (rows.length !== 8) return false;

    for (var i = 0; i < 8; i++) {
      var row = rows[i].replace(/[^pnbrqkPNBRQK1-8]/g, '');
      var sum = 0;
      var previous_was_number = false;

      for (var j = 0; j < row.length; j++) {
        if (row[j] >= '1' && row[j] <= '8') {
          sum += parseInt(row[j], 10);
          previous_was_number = true;
        } else {
          if (!previous_was_number) return false;
          sum++;
          previous_was_number = false;
        }
      }
      if (sum !== 8) return false;
    }

    return true;
  }

  function generateFen() {
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
          var piece = board[square].type;
          var color = board[square].color;
          var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
          fen += symbol;
        }
      }
      if (empty > 0) {
        fen += empty;
      }

      if (i > RANK_1) {
        fen += '/';
      }
      empty = 0;
    }

    fen += ' ' + (turn === WHITE ? 'w' : 'b');

    var flags = kingsideCastling[WHITE] ? 'K' : '';
    flags += queensideCastling[WHITE] ? 'Q' : '';
    flags += kingsideCastling[BLACK] ? 'k' : '';
    flags += queensideCastling[BLACK] ? 'q' : '';
    fen += ' ' + (flags || '-');

    fen += ' ' + (epSquare === EMPTY ? '-' : SQUARE_MAP[epSquare]);

    fen += ' ' + halfMoves + ' ' + moveNumber;

    return fen;
  }

  function setFen(fen) {
    if (!validFen(fen)) return false;

    // First, reset the board
    reset();

    var tokens = fen.replace(/\s+/g, ' ').split(' ');
    var position = tokens[0];
    var square = 0;

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

    kingsideCastling = {w: 0, b: 0};
    queensideCastling = {w: 0, b: 0};
    var castling = tokens[2];
    for (i = 0; i < castling.length; i++) {
      switch (castling.charAt(i)) {
        case 'K': kingsideCastling[WHITE] = 1; break;
        case 'Q': queensideCastling[WHITE] = 1; break;
        case 'k': kingsideCastling[BLACK] = 1; break;
        case 'q': queensideCastling[BLACK] = 1; break;
      }
    }

    epSquare = (tokens[3] === '-' ? EMPTY : SQUARE_MAP[tokens[3]]);
    halfMoves = parseInt(tokens[4], 10) || 0;
    moveNumber = parseInt(tokens[5], 10) || 1;

    updateSetup(generateFen());
    return true;
  }

  function reset() {
    board = new Array(128);
    for (var i = 0; i < 128; i++) {
      board[i] = null;
    }
    kings = {w: EMPTY, b: EMPTY};
    turn = WHITE;
    kingsideCastling = {w: 0, b: 0};
    queensideCastling = {w: 0, b: 0};
    epSquare = EMPTY;
    halfMoves = 0;
    moveNumber = 1;
    history = [];
    header = {};
    updateSetup(generateFen());
  }

  function put(piece, square) {
    if (!('type' in piece && 'color' in piece)) return false;
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) return false;
    if (!(square in SQUARES)) return false;
    var sq = SQUARES[square];
    board[sq] = {type: piece.type.toLowerCase(), color: piece.color};
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }
    updateSetup(generateFen());
    return true;
  }

  function remove(square) {
    if (!(square in SQUARES)) return null;
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }
    updateSetup(generateFen());
    return piece;
  }

  function get(square) {
    if (!(square in SQUARES)) return null;
    return board[SQUARES[square]];
  }

  function buildMove(from, to, flags, promotion) {
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

  function generateMoves(options) {
    function addMove(board, from, to, flags) {
      moves.push(buildMove(from, to, flags));
    }

    var moves = [];
    var us = turn;
    var them = us === WHITE ? BLACK : WHITE;

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece === null) continue;
      if (piece.color !== us) continue;

      var from = SQUARE_MAP[i];
      var type = piece.type;

      if (type === PAWN) {
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] === null) {
          addMove(board, from, SQUARE_MAP[square], BITS.NORMAL);

          square = i + PAWN_OFFSETS[us][1];
          if (RANK_2[us] === rank(i) && board[square] === null) {
            addMove(board, from, SQUARE_MAP[square], BITS.BIG_PAWN);
          }
        }

        for (var j = 2; j < 4; j++) {
          square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;

          if (board[square] !== null && board[square].color === them) {
            addMove(board, from, SQUARE_MAP[square], BITS.CAPTURE);
          } else if (square === epSquare) {
            addMove(board, from, SQUARE_MAP[square], BITS.EP_CAPTURE);
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] === null) {
              addMove(board, from, SQUARE_MAP[square], BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              addMove(board, from, SQUARE_MAP[square], BITS.CAPTURE);
              break;
            }

            if (type === KNIGHT || type === KING) break;
          }
        }
      }
    }

    if (kings[us] !== EMPTY && castling[us]) {
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_to = KING_CASTLE[us === WHITE ? 0 : 2];
        if (board[castling_to + 1] === null &&
            board[castling_to] === null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_to)) {
          addMove(board, SQUARE_MAP[kings[us]], SQUARE_MAP[castling_to], BITS.KSIDE_CASTLE);
        }
      }

      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_to = QUEEN_CASTLE[us === WHITE ? 0 : 2];
        if (board[castling_to - 1] === null &&
            board[castling_to] === null &&
            board[castling_to - 2] === null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_to)) {
          addMove(board, SQUARE_MAP[kings[us]], SQUARE_MAP[castling_to], BITS.QSIDE_CASTLE);
        }
      }
    }

    if (options) {
      var legalMoves = [];
      for (var i = 0; i < moves.length; i++) {
        if (makeMove(moves[i]).in_check) {
          undoMove();
          continue;
        }
        legalMoves.push(moves[i]);
      }
      return legalMoves;
    }

    return moves;
  }

  function makeMove(move) {
    var us = turn;
    var them = us === WHITE ? BLACK : WHITE;
    var from = SQUARES[move.from];
    var to = SQUARES[move.to];
    var king;

    history.push({
      move: move,
      kings: {w: kings.w, b: kings.b},
      turn: turn,
      castling: {w: kingsideCastling.w, b: kingsideCastling.b},
      epSquare: epSquare,
      halfMoves: halfMoves,
      moveNumber: moveNumber
    });

    if (move.flags & BITS.KSIDE_CASTLE || move.flags & BITS.QSIDE_CASTLE) {
      king = board[from];
      board[from] = null;
      board[to] = king;
      kings[us] = to;

      if (move.flags & BITS.KSIDE_CASTLE) {
        var rook_from = SQUARES[us === WHITE ? 'h1' : 'h8'];
        var rook_to = KING_CASTLE[us === WHITE ? 1 : 3];
        board[rook_from] = null;
        board[rook_to] = board[rook_to - 1];
        board[rook_to - 1] = null;
      } else {
        var rook_from = SQUARES[us === WHITE ? 'a1' : 'a8'];
        var rook_to = QUEEN_CASTLE[us === WHITE ? 1 : 3];
        board[rook_from] = null;
        board[rook_to] = board[rook_to + 1];
        board[rook_to + 1] = null;
      }
    } else {
      if (move.flags & BITS.EP_CAPTURE) {
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
        kingsideCastling[us] = 0;
        queensideCastling[us] = 0;
      }
    }

    if (board[to].type === ROOK) {
      if (us === WHITE) {
        if (from === SQUARES.a1) queensideCastling.w = 0;
        if (from === SQUARES.h1) kingsideCastling.w = 0;
      } else {
        if (from === SQUARES.a8) queensideCastling.b = 0;
        if (from === SQUARES.h8) kingsideCastling.b = 0;
      }
    }

    epSquare = (move.flags & BITS.EP_CAPTURE) ? from - PAWN_OFFSETS[us][0] : EMPTY;

    if (move.flags & BITS.BIG_PAWN) {
      if (us === WHITE) {
        epSquare = from - 16;
      } else {
        epSquare = from + 16;
      }
    }

    if (move.flags & BITS.CAPTURE) {
      halfMoves = 0;
    } else if (move.flags & BITS.NORMAL) {
      halfMoves++;
    }

    if (us === BLACK) {
      moveNumber++;
    }
    turn = them;

    updateSetup(generateFen());
    return {in_check: attacked(them, kings[them])};
  }

  function undoMove() {
    var old = history.pop();
    if (old === undefined) return null;

    board = new Array(128);
    for (var i = 0; i < 128; i++) {
      board[i] = null;
    }

    for (i = 0; i < old.kings.w.length; i++) {
      kings.w = old.kings.w[i];
      kings.b = old.kings.b[i];
    }
    turn = old.turn;
    kingsideCastling = old.castling.w;
    queensideCastling = old.castling.b;
    epSquare = old.epSquare;
    halfMoves = old.halfMoves;
    moveNumber = old.moveNumber;

    var move = old.move;
    var us = turn;
    var them = us === WHITE ? BLACK : WHITE;
    var from = SQUARES[move.from];
    var to = SQUARES[move.to];

    if (move.flags & BITS.KSIDE_CASTLE || move.flags & BITS.QSIDE_CASTLE) {
      var king = board[to];
      board[to] = null;
      board[from] = king;
      kings[us] = from;

      if (move.flags & BITS.KSIDE_CASTLE) {
        var rook_from = KING_CASTLE[us === WHITE ? 1 : 3];
        var rook_to = SQUARES[us === WHITE ? 'h1' : 'h8'];
        board[rook_from] = board[rook_to];
        board[rook_to] = null;
      } else {
        var rook_from = QUEEN_CASTLE[us === WHITE ? 1 : 3];
        var rook_to = SQUARES[us === WHITE ? 'a1' : 'a8'];
        board[rook_from] = board[rook_to];
        board[rook_to] = null;
      }
    } else {
      if (move.flags & BITS.EP_CAPTURE) {
        var ep_square = to - PAWN_OFFSETS[us][0];
        board[ep_square] = {type: PAWN, color: them};
      }

      if (move.promotion) {
        board[to] = {type: PAWN, color: us};
      } else {
        var piece = board[to];
        board[to] = null;
        board[from] = piece;
      }

      if (move.flags & BITS.CAPTURE) {
        board[to] = {type: (move.captured ? move.captured.type : ''), color: them};
      }
    }

    updateSetup(generateFen());
    return move;
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece === null || piece.color !== color) continue;

      var type = piece.type;

      if (type === PAWN && (i + PAWN_OFFSETS[color][2]) === square) {
        return true;
      }

      if (type === PAWN && (i + PAWN_OFFSETS[color][3]) === square) {
        return true;
      }

      for (var j = 0; j < PIECE_OFFSETS[type].length; j++) {
        var offset = PIECE_OFFSETS[type][j];
        var target = i;

        while (true) {
          target += offset;
          if (target & 0x88) break;

          if (target === square) return true;

          if (board[target] !== null) break;
        }
      }
    }
    return false;
  }

  function inCheck() {
    return attacked(turn === WHITE ? BLACK : WHITE, kings[turn]);
  }

  function inCheckmate() {
    return inCheck() && generateMoves().length === 0;
  }

  function inStalemate() {
    return !inCheck() && generateMoves().length === 0;
  }

  function insufficientMaterial() {
    var pieces = {};
    var bishops = [];
    var numPieces = 0;
    var sqColor = 0;

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      sqColor = (sqColor + 1) % 2;
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece) {
        pieces[piece.type] = (piece.type in pieces) ? pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sqColor);
        }
        numPieces++;
      }
    }

    if (numPieces === 2) return true;
    else if (numPieces === 3 && (pieces[KNIGHT] === 1 || pieces[BISHOP] === 1)) return true;
    else if (numPieces === pieces[BISHOP] + 2) {
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) return true;
    }
    return false;
  }

  function inThreefoldRepetition() {
    var moves = [];
    var positions = {};
    var fen;

    for (var i = 0; i <= history.length; i++) {
      fen = generateFen();
      positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        return true;
      }
    }

    return false;
  }

  function inDraw() {
    return halfMoves >= 100 || inStalemate() || insufficientMaterial() || inThreefoldRepetition();
  }

  function gameOver() {
    return inCheckmate() || inDraw();
  }

  function load(fen) {
    return setFen(fen);
  }

  function fen() {
    return generateFen();
  }

  function pgn() {
    var empty = 0;
    var result = '';
    for (var i in header) {
      result += '[' + i + ' "' + header[i] + '"]\n';
    }
    var moves = [];
    var moveNumber = 1;
    var move;
    for (i = 0; i < history.length; i++) {
      move = history[i].move;
      if (turn === BLACK && moveNumber % 2 === 0) {
        moves.push(moveNumber + '. ... ' + moveToString(move));
        moveNumber++;
      } else if (turn === WHITE) {
        moves.push(moveNumber + '. ' + moveToString(move));
        moveNumber++;
      } else {
        moves.push('... ' + moveToString(move));
      }
    }
    result += moves.join(' ') + ' ' + result;
    return result;
  }

  function header() {
    return header;
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
          var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
          s += ' ' + symbol + ' ';
        }
      }
      s += '|\n';
    }
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s;
  }

  function turn() {
    return turn;
  }

  function move(move) {
    var moveObj = null;
    if (validMove(move)) {
      moveObj = push({
        from: move.substring(0, 2),
        to: move.substring(2, 4),
        promotion: move.length === 5 ? move.charAt(4) : undefined
      });
    }
    return moveObj;
  }

  function undo() {
    var move = undoMove();
    return move;
  }

  function perft(depth) {
    var moves = generateMoves({legal: true});
    var nodes = 0;
    var color = turn;

    if (depth === 0) return 1;

    for (var i = 0; i < moves.length; i++) {
      var move = moves[i];
      if (!makeMove(move)) continue;
      nodes += perft(depth - 1);
      undoMove();
    }

    return nodes;
  }

  function get(square) {
    return board[SQUARES[square]];
  }

  function put(piece, square) {
    return put(piece, square);
  }

  function remove(square) {
    return remove(square);
  }

  function board() {
    if (board[0] === undefined) {
      return undefined;
    }
    return board;
  }

  function history() {
    var reversedHistory = [];
    var move;
    for (var i = 0; i < history.length; i++) {
      move = history[i];
      reversedHistory.push({
        move: move.move,
        fen: generateFen(),
        turn: move.turn
      });
    }
    return reversedHistory;
  }

  var board = new Array(128);
  var kings = {w: EMPTY, b: EMPTY};
  var turn = WHITE;
  var kingsideCastling = {w: 0, b: 0};
  var queensideCastling = {w: 0, b: 0};
  var epSquare = EMPTY;
  var halfMoves = 0;
  var moveNumber = 1;
  var history = [];
  var header = {};

  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }

  function updateSetup(fen) {
    if (history.length > 0) return;

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1';
      header['FEN'] = fen;
    }
  }

  function rank(i) {
    return i >> 4;
  }

  function file(i) {
    return i & 15;
  }

  function algebraic(n) {
    var file = 'abcdefgh'.charAt(file(n));
    var rank = (rank(n) + 1).toString();
    return file + rank;
  }

  function moveToString(move) {
    var moveString;

    if (move.flags & BITS.KSIDE_CASTLE) {
      moveString = 'O-O';
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      moveString = 'O-O-O';
    } else {
      var from = algebraic(move.from);
      var to = algebraic(move.to);
      moveString = from + to;

      if (move.promotion) {
        moveString += move.promotion.toUpperCase();
      }
    }

    return moveString;
  }

  return {
    load: load,
    fen: fen,
    pgn: pgn,
    header: header,
    ascii: ascii,
    turn: turn,
    move: move,
    undo: undo,
    moves: moves,
    inCheck: inCheck,
    inCheckmate: inCheckmate,
    inStalemate: inStalemate,
    inDraw: inDraw,
    gameOver: gameOver,
    validateFen: validFen,
    perft: perft,
    get: get,
    put: put,
    remove: remove,
    board: board,
    history: history
  };
};

if (typeof exports !== 'undefined') {
  exports.Chess = Chess;
}
if (typeof define !== 'undefined') {
  define(function() { return Chess; });
}
