import { Chess } from 'https://unpkg.com/chess.js@1.0.0';

(() => {
  const game = new Chess();
  const boardEl = document.querySelector('chess-board');
  const statusEl = document.getElementById('status');
  const codeBox = document.getElementById('codeBox');
  const codeText = document.getElementById('theCode');
  const verifyBtn = document.getElementById('verifyBtn');
  const codeInput = document.getElementById('codeInput');
  const msg = document.getElementById('msg');

  function updateStatus() {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        statusEl.textContent = 'كش مات! حصلت على الرمز.';
        const thisCode = DEFAULT_CODES['p1'];
        codeBox.style.display = 'block';
        codeText.textContent = thisCode;
        GameProgress.markSolved('p1');
      } else if (game.isDraw()) {
        statusEl.textContent = 'تعادل. حاول مرة أخرى.';
      }
      return;
    }
    statusEl.textContent = game.inCheck()
      ? 'تحذير: كش!'
      : 'دورك — حرّك أي قطعة.';
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0 || game.isGameOver()) return;
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    boardEl.setPosition(game.fen());
    updateStatus();
  }

  boardEl.addEventListener('move', (e) => {
    const { from, to } = e.detail;
    const move = game.move({ from, to, promotion: 'q' });
    if (move) {
      updateStatus();
      setTimeout(makeRandomMove, 500);
    } else {
      boardEl.undo();
    }
  });

  boardEl.setPosition(game.fen());
  updateStatus();
})();
