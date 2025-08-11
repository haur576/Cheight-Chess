const boardElement = document.getElementById("board");
    const selectionRow = document.getElementById("selection-row");
    const infoBox = document.getElementById('infoBox');
    const moveLog = document.getElementById('moveLog');
    const undoButton = document.getElementById('undo-button');
    let board;
    let prevBoard;
    let winner = 0;
    let promotioning = false;
    
    let whosTurn = null;
    let movecount = 0;
    
    let selected = null;
    let validMoves = [];
    let moveFrom = null;
    let moveTo = null;

    function restart(){
      board = [
        ["象\n士", "將", "卒", "象\n士"],
        ["車", "馬\n包", "馬\n包", "車"],
        ["卒", "卒", "卒", "卒"],
        ["", "", "", ""],
        ["", "", "", ""],
        ["兵", "兵", "兵", "兵"],
        ["俥", "傌\n炮", "傌\n炮", "俥"],
        ["相\n仕", "帥", "兵", "相\n仕"]
      ];
      undoButton.disabled=true;
      winner = 0;
      promotioning = false;
      whosTurn = -1;
      movecount = 0;
      selected = null;
      moveFrom = null;
      moveTo = null;
      validMoves = [];
      changeSide();
      drawBoard();
      addLog("=====New Game Start=====");
    }
    
    const isRed = c => /[帥兵俥傌炮相仕]/.test(c);
    const isBlack = c => /[將卒車馬包象士]/.test(c);
    const height = (x, y) => board[x][y].split("\n").length;

    function checkRule(){
      winner = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 4; c++) {
          const piece = board[r][c];
          const [top, ...rest] = piece.split("\n");
            if(r==0 && top == "兵") promotionBegin(r,c)
            if(r==7 && top == "卒") promotionBegin(r,c)
          if (piece.indexOf("\n將")!=-1){
            winner=1;
            showInfo("🔴 wins!");
          }
          if (piece.indexOf("\n帥")!=-1){
            winner=-1;
            showInfo("⚫ wins!");
          }
        }
      }
    }
    function drawBoard() {
      checkRule();
      boardElement.innerHTML = "";
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 4; c++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          const piece = board[r][c];
          if (piece) {
            const [top, ...rest] = piece.split("\n");
            cell.innerText = top.substring(0,1);
            const bring = top.length>1 ? parseInt(top.substring(1)) : 0;
            if (rest.length) {
              const stack = document.createElement("span");
              stack.classList.add("stack");
              for (let i =0; i< rest.length; i++){
                const stacked = document.createElement("span");
                stacked.classList.add(isRed(rest[i]) ? "red" : isBlack(rest[i]) ? "black" : ""); //The last one should give an error
                stacked.innerText = rest[i].substring(0,1);
                if(bring>i && JSON.stringify([r,c]) === JSON.stringify(selected))
                  stacked.classList.add("carried");
                stack.appendChild(stacked);
              }
              cell.appendChild(stack);
            }
            cell.classList.add(isRed(top) ? "red" : isBlack(top) ? "black" : "");
          }
          if (validMoves.some(([vr, vc]) => vr === r && vc === c)) {
            cell.classList.add("available");
          }
          if (JSON.stringify([r,c]) === JSON.stringify(selected)){
            cell.classList.add("selected");
          }
          if (JSON.stringify([r,c]) === JSON.stringify(moveFrom) || JSON.stringify([r,c]) === JSON.stringify(moveTo)){
            cell.classList.add("moved");
          }
          if (winner!=0&&board[r][c].indexOf("將")!=-1){
            cell.classList.add(winner==-1?"win":"lose");
          }
          if (winner!=0&&board[r][c].indexOf("帥")!=-1){
            cell.classList.add(winner==1?"win":"lose");
          }
          cell.onclick = () => handleClick(r, c);
          boardElement.appendChild(cell);
        }
      }
    }

    // cdef + 12345678
    const toMoveString = pos => String.fromCharCode(99 + pos[1])+(8-pos[0]);

    function addMoveLog(from, to, movedPiece, special="") {
      addLog(`${movecount} ${isRed(movedPiece) ? '🔴' : '⚫'} ${movedPiece}: (${toMoveString(from)}) → (${toMoveString(to)})` + (special?", "+special:""));
    }
    function addLog(text){
      const logLine = document.createElement('div');
      logLine.innerText = text;
      moveLog.appendChild(logLine);
      moveLog.scrollTop = moveLog.scrollHeight;
    }

    function showAlert(msg) {
      infoBox.innerText = msg;
      infoBox.classList.remove("info");
      infoBox.classList.add("alert");
      setTimeout(() => {if (infoBox.innerText === msg)clearInfoBox()}, 2000);
    }
    function showInfo(msg) {
      infoBox.innerText = msg;
    }
    function clearInfoBox() {
      infoBox.classList.remove("alert");
      infoBox.classList.add("info");
      infoBox.innerText = "";
    }

    function changeSide(){
      whosTurn = whosTurn*-1;
      if(whosTurn == 1) movecount+=1;
      showInfo(`Now: ${whosTurn==1? '🔴' : '⚫'}'s turn.`)
    }
    
    function handleClick(r, c) {
      selectionRow.innerHTML = "";
      if(winner!=0) return;
      if(!promotioning){
        if (selected) {
          const [sr, sc] = selected;
          const [movingPiece, ...under] = board[sr][sc].split("\n");
          const flag = /[仕士]/.test(movingPiece);
          if (sr===r && sc===c && flag && under.length){
            let follow = /[仕士]\d+/.test(movingPiece) ? parseInt(movingPiece.substring(1))+1 : 1; 
            if(follow+1 >height(r,c)){
              follow='';
              selected = null;
              validMoves = [];
            }
            board[sr][sc] = movingPiece.substring(0,1) + follow + "\n" + under.join("\n");
          }
          else if (isValidMove(movingPiece, sr, sc, r, c)) {
            prevBoard = JSON.stringify(board);
            undoButton.disabled=false;
            if(flag){
              let follow = /[仕士]\d+/.test(movingPiece) ? parseInt(movingPiece.substring(1)) : 0;
              board[r][c] = movingPiece.substring(0,1)+ (follow>0? "\n"+under.slice(0,follow).join("\n") : "") + (board[r][c] ?  "\n" + board[r][c] : "");
              board[sr][sc] = under.slice(follow).join("\n");
              addMoveLog([sr, sc], [r, c], movingPiece,"carrying "+follow);
            }
            else{
              board[r][c] = board[r][c] ? movingPiece + "\n" + board[r][c] : movingPiece;
              board[sr][sc] = under.join("\n");
              addMoveLog([sr, sc], [r, c], movingPiece);
            }
            changeSide();
            moveFrom=[sr,sc]
            moveTo=[r,c]
            selected = null;
            validMoves = [];
          } else {
            // showAlert("Invalid move"); //Deprecated: or cancelling move
            selected = null;
            validMoves = [];
          }
        } else if (board[r][c]) {
          const [piece] = board[r][c].split("\n");
          if(isRed(piece)==(whosTurn==1)){
            selected = [r, c];
            validMoves = generateValidMoves(piece, r, c);
          }
        }
        drawBoard();
        if(board[r][c]){
          selectionRow.innerHTML = "";
          const piece = board[r][c].split("\n");
          
          const top = document.createElement("div");
          top.classList.add("cell");
          top.innerText="Top"
          selectionRow.appendChild(top)
          for(let i=0; i<piece.length;i++){
            const now= piece[i]
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText = now.substring(0,1);
            cell.classList.add(isRed(now) ? "red" : isBlack(now) ? "black" : "");
            selectionRow.appendChild(cell);
          }
          const bottom = document.createElement("div");
          bottom.classList.add("cell");
          bottom.innerText="Bottom"
          selectionRow.appendChild(bottom)
        }
      }
      else{ //promotioning
        whosPromoting = -whosTurn //Back one step
        if(board[r][c]){
          selectionRow.innerHTML = "";
          const piece = board[r][c].split("\n");
          
          const top = document.createElement("div");
          top.classList.add("cell");
          top.innerText="Top"
          selectionRow.appendChild(top)
          for(let i=0; i<piece.length;i++){
            const now= piece[i]
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText = now.substring(0,1);
            cell.classList.add(isRed(now) ? "red" : isBlack(now) ? "black" : "");
            if(now === "兵" || now === "卒" || isRed(now) != (whosPromoting==1)) 
              cell.classList.add("unavailable");
            else if (i==0 && ((whosPromoting==1 && r==0) || (whosPromoting==-1 && r==7))){
              cell.classList.add("unavailable");
            }
            else 
              cell.onclick = () => promotionEnd(r,c,i);
            selectionRow.appendChild(cell);
          }
          const bottom = document.createElement("div");
          bottom.classList.add("cell");
          bottom.innerText="Bottom"
          selectionRow.appendChild(bottom)
        }
      }
    }
    
    function promotionBegin(r,c){
      promotioning=[r,c];
      showInfo("Promotion: Select a grid and then a piece from stack to switch with your 兵/卒.")
    }
    function promotionEnd(r,c,i){
      let pieces = board[r][c].split("\n");
      const piece = pieces[i];
      const [pr,pc] =promotioning;
      const pawn = board[pr][pc][0];
      board[pr][pc] = piece + board[pr][pc].substring(1,);
      pieces[i] = pawn;
      board[r][c] = pieces.join("\n");
      selectionRow.innerHTML = "";
      drawBoard();
      showInfo(`Promotion end. Now: ${whosTurn==1? '🔴' : '⚫'}'s turn.`)
      promotioning=null;
    }

    function isValidMove(piece, sr, sc, tr, tc) {
      return generateValidMoves(piece, sr, sc).some(([r, c]) => r === tr && c === tc);
    }
    
    function generateValidMoves(piece, r, c) {
      const moves = [];
      const dr = isRed(piece) ? -1 : 1;
      const isEmpty = (x, y) => board[x][y] === "";
      const inBounds = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 4;

      const blocked = (x, y) => !inBounds(x, y) || (!isEmpty(x, y) && height(x,y)>= height(r,c));
      const otherSide = (x, y) => {
        if (!inBounds(x, y)) return false;
        if (!board[x][y]) return false;
        const top = board[x][y].split("\n")[0];
        return (isRed(top) && isBlack(piece)) || (isBlack(top) && isRed(piece));
      };

      const add = (x, y) => {
        if (otherSide(x, y) || !blocked(x,y)) moves.push([x, y]);
      };

      if (piece === "兵" || piece === "卒") {
        add(r + dr, c);
      } else if (piece === "馬" || piece === "傌") {
        [[1, 2], [2, 1], [-1, 2], [-2, 1], [-1, -2], [-2, -1], [1, -2], [2, -1]].forEach(([dx, dy]) => {
          const mx = r + dx, my = c + dy;
          const blockX = r + dx / Math.abs(dx) * Math.floor(Math.abs(dx)/2);
          const blockY = c + dy / Math.abs(dy) * Math.floor(Math.abs(dy)/2);
          if (!blocked(blockX, blockY)) add(mx, my);
        });
      } else if (piece === "炮" || piece === "包") {
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
          let jumped = false;
          for(let i=1;;i++){
            const x=r+dx*i,y=c+dy*i;
            if(!inBounds(x,y)) break;
            if(!jumped){
              if(!blocked(x,y) && !otherSide(x,y)) moves.push([x,y]);
              else if (blocked(x,y)) jumped=true;
            } else {
              if(otherSide(x,y)) moves.push([x,y]); 
              if (blocked(x,y)) break;
            }
          }
        });
      } else if (piece === "相" || piece === "象") {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy])=>{
          for(let i=1;;i++){
            const x=r+dx*i,y=c+dy*i;
            if(otherSide(x,y) || !blocked(x,y)) moves.push([x,y]);
            if(blocked(x,y)) break;
          }
        });
      } else if (/[仕士]/.test(piece)) {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy])=>moves.push([r+dx,c+dy]));
      } else if (piece === "帥" || piece === "將") {
        [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy])=>add(r+dx,c+dy));
      } else if (piece === "俥" || piece === "車") {
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
          for(let i=1;;i++){
            const x=r+dx*i,y=c+dy*i;
            if(otherSide(x,y) || !blocked(x,y)) moves.push([x,y]);
            if(blocked(x,y)) break;
          }
        });
      }
      return moves;
    }
    function undoMove(){
      movecount-=1
      board=JSON.parse(prevBoard);
      changeSide();
      addLog("Undo.");
      undoButton.disabled=true;
      selected=null;
      validMoves = [];
      promotioning=null;
      drawBoard();
    }
    restart();