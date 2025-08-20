// Evaluation function: Given by Li-Sheng Guo

/* The base value B(P) is given by the following (heuristically chosen) 
  Pawns receives additional value when closer to promotion:
  0 ranks to promote: +5
  1 rank  to promote: +4
  2 ranks to promote: +2
  3 ranks to promote: +1
*/
function pieceVal(piece,r,c){
  if (piece === "兵"){
    let Promdist = rowNo-r
    if(Promdist == 0) return 6; 
    if(Promdist == 1) return 5; 
    if(Promdist == 2) return 3; 
    if(Promdist == 3) return 2;
    return 1
  }
  else if (piece === "卒") {
    let Promdist = r-1;
    if(Promdist == 0) return 6; 
    if(Promdist == 1) return 5; 
    if(Promdist == 2) return 3; 
    if(Promdist == 3) return 2;
    return 1
  } else if (piece === "馬") return 3;
    else if (piece === "傌") return  3;
    else if (piece === "包") return 3.5;
    else if (piece === "炮") return  3.5;
    else if (piece === "相") return 4;
    else if (piece === "象") return  4;
    else if (/[士]/.test(piece)) return 6;
    else if (/[仕]/.test(piece)) return  6;
    else if (piece === "車") return 6;
    else if (piece === "俥") return  6;
    else if (piece === "將") return  0; //Handled by another way.
    else if (piece === "帥") return  0; //Handled by another way.
    else return 0; //The piece is empty
}

/* Li-Sheng Guo::
The evaluation of the board is the sum of the evaluations of all stacks on the board.

For a stack S=(P_1,P_2,...,P_k) with P_1 being the top piece, its evaluation is defined recursively as follows:

Ev(S) := 0                                                     if S is empty;
         C(P_1) + max(0,B(P_1) + λ * Ev(P_2,...,P_k))          if P_1 is not a guard;
         C(P_1)+B(P_1)+ λ*max(0,{Ev(P_i,...,P_k) : 2 ≤ i ≤ k}) if P_1 is a guard,

where 
. B(P) : the base value of piece P (heuristically chosen)
. C(P_1) : the **control score**, defined below
. λ : descending factor (heuristically chosen)
. Ev(S) gets a negative sign if counted for black pieces.
 */
let lambda = 0.7

function evaluateBoard() {
  //Find the Kings' position
  let redKing;
  let blackKing;
  for (let r = 0; r < rowNo; r++) {
    for (let c = 0; c < colNo; c++) {
      if (/[帥]/.test(board[r][c])) redKing = [r,c]
      if (/[將]/.test(board[r][c])) blackKing = [r,c]
    }
  }
  let evalsum=0;
  for (let r = 0; r < rowNo; r++) {
    for (let c = 0; c < colNo; c++) {
      evalsum += Ev(board[r][c].split("\n"),r,c,redKing,blackKing);
    }
  }
  return evalsum;
}

function Ev(stack,r,c,rK,bK){
  if(!stack.length) return 0;
  let [top, ...below] = stack
  
  if (!/[仕士]/.test(top)){
    return (isRed(top) ? 1 : -1) 
           * ( controlScore(top,r,c,rK,bK) 
             + Math.max( 0, pieceVal(top)+ (isRed(top) ? 1 : -1) * lambda*Ev(below,r,c,rK,bK)))
  }
  else{
    return (isRed(top) ? 1 : -1) 
           * ( controlScore(top,r,c,rK,bK) 
             + pieceVal(top)
             + lambda * Math.max( 0, Array.from({length: below.length}, (_, i) => (isRed(top) ? 1 : -1) *Ev(below.slice(i),r,c,rK,bK))))
  }
}

/* Control score: determined by the squares controlled by the piece P_1.

A square is __controlled by P_1 __ if an enemy king piece can be captured by P_1 there.

Each controlled square contributes a score of (γ * (1 + 2^-d)), where d is the L_inf distance to the enemy king. 

γ is heuristically chosen to be 0.25.
*/
let gamma = 0.25

function controlScore(piece, r, c, redKing, blackKing){
    let control_sum=0;
    const dr = isRed(piece) ? -1 : 1; //direction
    const target = isRed(piece) ? blackKing : redKing;

    const isEmpty = (x, y) => board[x][y] === "";
    const inBounds = (x, y) => x >= 0 && x < rowNo && y >= 0 && y < colNo;

    const blocked = (x, y) => !inBounds(x, y) || (!isEmpty(x, y) && height(x,y)>= height(r,c));
    const otherSide = (x, y) => {
      if (!inBounds(x, y)) return false;
      if (!board[x][y]) return false;
      const top = board[x][y].split("\n")[0];
      return (isRed(top) && isBlack(piece)) || (isBlack(top) && isRed(piece));
    };

    const add = (x, y) => {
      if(!inBounds(x, y)) return;
      let d = L_inf([x,y],target);
      control_sum += gamma * (1+ Math.pow(2,-d));
      if (d==0) control_sum+=2
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
            // if(!blocked(x,y) && !otherSide(x,y)) moves.push([x,y]);
            if (blocked(x,y)) jumped=true;
          } else {
            add(x,y); 
            if (blocked(x,y)) break;
          }
        }
      });
    } else if (piece === "相" || piece === "象") {
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy])=>{
        for(let i=1;;i++){
          const x=r+dx*i,y=c+dy*i;
          add(x,y);
          if(blocked(x,y)) break;
        }
      });
    } else if (/[仕士]/.test(piece)) {
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy])=>add(r+dx,c+dy));
    } else if (piece === "帥" || piece === "將") {
      if(KingTakeKing)
        [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy]) => {add(r+dx,c+dy)});
    } else if (piece === "俥" || piece === "車") {
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
        for(let i=1;;i++){
          const x=r+dx*i,y=c+dy*i;
          add(x,y);
          if(blocked(x,y)) break;
        }
      });
    }
    return control_sum
}

function L_inf (pieceA,pieceB){
  return Math.max(Math.abs(pieceA[0]-pieceB[0]),Math.abs(pieceA[1]-pieceB[1]))
}