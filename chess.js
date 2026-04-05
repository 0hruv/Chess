const chessPieces = [
    "♜", "♞", "♝", "♛", "♚", "♟", 
    "♙" ,"♖", "♘", "♗", "♕", "♔",  
];

const chessPiecesMap = {
    w_king: "♔", w_queen: "♕", w_rook: "♖", w_bishop: "♗", w_knight: "♘", w_pawn: "♙",
    b_king: "♚", b_queen: "♛", b_rook: "♜", b_bishop: "♝", b_knight: "♞", b_pawn: "♟"
};

// let currentBoard = create2DArray(8);
let turn = "black";
let selected = [-1,-1];
let nothingSelected = [ - 1 , -1]; //constant array
let moves = [];
let captureMoves = [];

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

            chessSquare.id = "square" + i + j;
            chessSquare.textContent = setBoard(i,j);
            
            setColor(i,j,chessSquare);

            // currentBoard[i][j] = chessSquare.textContent;

            chessSquare.addEventListener('click', () => {
            selectPiece(i,j,chessSquare.textContent)
            }
            );

            chessRow.appendChild(chessSquare);
        }
        chessBoard.appendChild(chessRow);
    }
}

// function create2DArray(a)
// {
//     let arr = new Array(a);

//     for (let i =0 ; i < a ; i++)
//     {
//         arr[i] = new Array(a);
//     }

//     return arr;
// }

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

function selectPiece(i , j , piece )
{
    if ((piece == " " && EqualArray(nothingSelected,selected)) || getPieceColor(piece) != turn )
    {
        return ;
    }

    // if (!EqualArray(nothingSelected,selected) )
    // {

    // }

    else{
        cancelSelect();

        let selectedSquare = getID(i,j);
        selectedSquare.style.backgroundColor = "#fca33e";
        selected = [i ,j];

        showMoves(i,j,piece);


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

function cancelSelect()
{
    if ( EqualArray(nothingSelected,selected) == false ){
        let x = selected[0];
        let y = selected[1];
        setColor(x,y,getID(x,y));    
    }
    else{
        return ;
    }
    
    console.log("HI!");
    for (let index = 0 ; index < 2 ; index++)
    {
        let boxParent = getID(moves[index][0],moves[index][1]);
        boxParent.removeChild(boxParent.lastChild);
    }

    for (let index = 0 ; index < captureMoves.length ; index++)
    {
        let x = captureMoves[index][0];
        let y = captureMoves[index][1];
        setColor(x,y,getID(x,y));
    }

    moves = [];
    captureMoves = [];

}

function setColor(i,j,chessSquare)
{
        if ((i+j) % 2 == 0)
        {
            chessSquare.style.backgroundColor = "#EBECD0";
        }
        else{
            chessSquare.style.backgroundColor = "#B58863";
        }
}

function EqualArray( a , b)
{
    for (let index = 0 ; index < a.length ; index++)
    {
        if (a[index] != b[index])
        {
            return false;
        }
    }
    return true;

}

function showMoves(i , j , piece)
{
    switch (piece) {
    case chessPiecesMap.b_pawn:
        blackPawn(i,j);
        break;
    }
    
    for (let a = 0 ; a < moves.length ; a++)
    {
        let possibleMove = getID(moves[a][0] ,moves[a][1]);
        let moveDot = document.createElement("div");
        moveDot.className = "move-dot";
        possibleMove.appendChild(moveDot);
    }

    for (let a = 0 ; a < captureMoves.length ; a++)
    {
        let possibleMove = getID(captureMoves[a][0] ,captureMoves[a][1]);
        possibleMove.style.backgroundColor = "red";
    }


}

function blackPawn(i,j)
{
    let forward = [[i+1,j]];
    if (i == 1)
    {
        forward.push([i+2,j]);
    }
    let clr = getColor(i,j);

    for (let a = 0 ; a<forward.length ; a++)
    {
        let x = forward[a][0];
        let y = forward[a][1];
        if (checkObstruction(x,y,clr) == 0)
        {
            moves.push(forward[a]);
        }
        else{
            break;
        }
    }

    let diagonal = [[i+1,j-1],[i+1,j+1]];

    for (let a = 0 ; a<diagonal.length ; a++)
    {
        let x = diagonal[a][0];
        let y = diagonal[a][1];
        if (checkObstruction(x,y,clr) == 2)
        {
            captureMoves.push(diagonal[a]);
        }
    }
}

function checkObstruction(i,j,color)
{
    if (!inBoundary(i,j))
    {
        return -1;
    }
    else if (getPiece(i,j) == " " )
    {
        return 0; //no obstruction
    }
    else if (getColor(i,j) == color)
    {
        return 1; //same color 
    }
    else{
        return 2;//different color(enemy)
    }
}

function getPiece(i,j)
{
    return getID(i,j).textContent;
}

function inBoundary(i,j)
{
    if (i >= 0  && i < 8 && j >= 0 && j < 8)
    {
        return true;
    }
    return false;
}

function getColor(i,j)
{
    return getPieceColor(getPiece(i,j));
}

function getID(i,j)
{
    return document.getElementById("square"+i+j);
}