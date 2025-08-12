# Cheight-Chess
A new version of combination of Chinese Chess and Classic Chess where we capture pieces by simply stack on it.

Here to play: https://haur576.github.io/Cheight-Chess/

### **Why Cheight Chess?**
In the beginning, we want to find the limit of how dense a chessboard could be. Ultimately, as a Chinese chess container box usually comes in size of 4\*4\*2, we would like to know if there is a way of playing a game directly on this size. And this game appeared.

For now it is of size 8\*4, and we are working on finding a variant to play on a 4\*4 board with all 32 pieces. (It is possible! But more beta tests shall be done before it become stable.)

### **What's upcoming - Todo list**
- Multiple undo (currently there's only one step undo)
- Rule book clarifications and localizations (e.g. in Chinese)
- Figuring out a good way to record 仕/士 carrying and 兵/卒 promotion.
- Ultimate goal: A chess bot for this game.
  - A piece value suggestion
  - Value modifier when stacked/ stacking a strong piece
  - Find mate in * moves
- A rule for 4\*4 variant 

We would love to hear people submitting pull requests on anything including (but not limited to) these!

### **Suggestion box from people - another Todo list**
Here we list some suggestions received from people played:

- A chess timer 
- Suicide prevention on/off
- An option to rotate pieces of black side by 180 degree.
- A better way to show stacked pieces when overflowing
- Any UI redesign

Pull requests on these are also highly welcome!

## **Game Rules**

### **Movements:**  
- **兵/卒**: Moves forward only. Promote at the end rank.  
- **炮/包**: Move and capture like a cannon in Chinese Chess.  
- **傌/馬**: Move like a knight. Blocked by obstacles directly in front.  
- **俥/車**: Move like a rook: any blocks horizontally & vertically.  
- **相/象**: Move like a bishop: any blocks diagonally.  
- **仕/士**: Move one step diagonally. Has special skills to carry pieces.  
- **帥/將**: Moves like a king: one block in 8-neighborhood.  

---

### **Move and Capturing (Stacking):**  
- Except 炮/包, every piece captures exactly like it moves.  
- When capturing, you don't remove your opponent's piece; instead, you stack your piece on and cover it.  
- Only pieces shown on top can move. Whenever a piece is moved away, the lower pieces show up again.  
- You lose (or the other wins) when your king is stacked by any piece.  

---

### **Height & Blockade:**  
- The height of a piece is the number of pieces below it.  
- You are only blocked by a piece of the same height; think of it as moving at the same level, then dropping the piece at the target grid.  
- When capturing, ignore the height of the target grid — you can always capture regardless of height!  

### **Example of blockades:**  
- A height-2 **傌/馬** is not blocked by any height-0 or height-1 pieces.  
- A height-4 **俥/車** is only blocked by a stack of pieces with height ≥ 4, and thus may often attack several pieces in a row.  
- A height-1 **炮/包** is not blocked by any height-0 pieces. Since movement before being blocked is considered a move, you cannot stop on an opponent's piece if nothing is blocking between.  

> **Terminology:**  
> - *Move* = Move a piece to an empty grid or on top of one of your own pieces.  
> - *Capture* = Move a piece onto an opponent's piece.  

---

### **Special Moves of 仕/士:**  
- When 仕/士 moves, it can always stack on any piece — even of the same side.  
- When 仕/士 moves, it can carry any number of pieces directly below it to a new grid.  

---

### **Promotion of 兵/卒:**  
- When a 兵/卒 appears on top at the end rank, switch its place with another non-兵/卒 piece of the same side.  
- You cannot select a top piece in the end rank, but you can select other pieces in the end rank.  

## **Acknowledgement**

The git repository holder would love thank his friends for beta-test the game, giving crucial advices and suggestions to make this game better. This game is made possible because of you.

Also, thank you for playing this game and give feedback/git change!