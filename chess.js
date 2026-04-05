const chessPieces = [
    "♜", "♞", "♝", "♛", "♚", "♟", 
    "♙" ,"♖", "♘", "♗", "♕", "♔",  
];

const chessPiecesMap = {
    w_king: "♔", w_queen: "♕", w_rook: "♖", w_bishop: "♗", w_knight: "♘", w_pawn: "♙",
    b_king: "♚", b_queen: "♛", b_rook: "♜", b_bishop: "♝", b_knight: "♞", b_pawn: "♟"
};

let currentBoard = create2DArray(8);
let turn = "white";
let selected = [-1,-1];

createChessBoard();



function createChessBoard()
{
    let chessBoard = document.querySelector(".board");
    for (let i = 0 ; i < 8 ; i++)
    {
        let chessRow = document.createElement("div");
        chessRow.className = "row";
        
        for (let j = 0 ; j < 8 ; j++)
        {
            let chessSquare = document.createElement("button");
            chessSquare.className = "square";

            if ((i+j) % 2 == 0)
            {
                chessSquare.style.backgroundColor = "#EBECD0";
            }
            else{
                chessSquare.style.backgroundColor = "#B58863";
            }
            
            chessSquare.id = "square" + i + j;
            chessSquare.textContent = setBoard(i,j);

            currentBoard[i][j] = chessSquare.textContent;

            chessSquare.addEventListener("click",movePiece(i,j,chessSquare.textContent));

            chessRow.appendChild(chessSquare);
        }
        chessBoard.appendChild(chessRow);
    }
}

function create2DArray(a)
{
    let arr = new Array(a);

    for (let i =0 ; i < a ; i++)
    {
        arr[i] = new Array(a);
    }

    return arr;
}

function setBoard(i , j)
{
    if ( i > 1 && i < 6)
    {
        return " ";
    }

    if ( i == 1)
    {
        return chessPieces[5];
    }
    if (i == 6)
    {
        return chessPieces[6];
    }

    if (j > 4)
    {
        j = 7-j;
    }

    return chessPieces[i+j];
    
}

function movePiece(i , j , piece )
{
    if ((piece == " " && selected == [-1,-1]) || getPieceColor(piece) != turn )
    {
        return ;
    }

    else{
        let selectedSquare = document.getElementById("square"+i+j);
        selectedSquare.style.backgroundColor = "#b99b15";
    }
}

function getPieceColor(symbol) {
    let code = symbol.charCodeAt(0);
    
    if (code >= 0x2654 && code <= 0x2659) {
        return "white";
    } 
    else if (code >= 0x265A && code <= 0x265F) {
        return "black";
    }
}