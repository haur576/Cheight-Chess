class gamemode {
  constructor(name, row, col, board, KingTakeKing=true, startMsg="Game Start!") {
    this.name = name;
    this.board = board;
    this.row = row;
    this.col = col;
    this.KingTakeKing = KingTakeKing;
    this.startMsg = startMsg;
  }

  Start() {
    showInfo(this.startMsg)
  }
}

games = [
  new gamemode (
      "Normal", 8, 4,
      [ ["象\n士", "卒\n包", "將\n包", "象\n士"],
        ["卒\n車", "卒\n馬", "卒\n馬", "卒\n車"],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["兵\n俥", "兵\n傌", "兵\n傌", "兵\n俥"],
        ["相\n仕", "兵\n炮", "帥\n炮", "相\n仕"]
      ]) ,
  new gamemode (
      "Old", 8, 4, 
      [
        ["象\n士", "卒", "將", "象\n士"],
        ["車", "馬\n包", "馬\n包", "車"],
        ["卒", "卒", "卒", "卒"],
        ["", "", "", ""],
        ["", "", "", ""],
        ["兵", "兵", "兵", "兵"],
        ["俥", "傌\n炮", "傌\n炮", "俥"],
        ["相\n仕", "兵", "帥", "相\n仕"]
      ]) ,
  new gamemode (
      "Minimal", 4, 4, 
      [
        ["象\n士", "卒\n包", "將\n包", "象\n士"],
        ["卒\n車", "卒\n馬", "卒\n馬", "卒\n車"],
        ["兵\n俥", "兵\n傌", "兵\n傌", "兵\n俥"],
        ["相\n仕", "兵\n炮", "帥\n炮", "相\n仕"]
      ], false, "Extra rule: In minimal games, 帥/將 cannot take each other.") ,
  new gamemode (
      "Minimal-old", 4, 4, 
      [
        ["象\n士", "馬\n包", "馬\n包", "象\n士"],
        ["卒\n車", "卒\n卒", "將\n卒", "卒\n車"],
        ["兵\n俥", "兵\n兵", "帥\n兵", "兵\n俥"],
        ["相\n仕", "傌\n炮", "傌\n炮", "相\n仕"]
      ], false, "Extra rule: In minimal games, 帥/將 cannot take each other."),
  new gamemode (
  "Test", 8, 4,
  [ ["卒", "", "將", ""],
    ["", "卒", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "兵", ""],
    ["", "", "帥", "兵"]
  ]) 
]