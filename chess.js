const chessPieces = [
    "♜", "♞", "♝", "♛", "♚", "♟", 
    "♙" ,"♖", "♘", "♗", "♕", "♔",  
];

const chessPiecesMap = {
    w_king: "♔", w_queen: "♕", w_rook: "♖", w_bishop: "♗", w_knight: "♘", w_pawn: "♙",
    b_king: "♚", b_queen: "♛", b_rook: "♜", b_bishop: "♝", b_knight: "♞", b_pawn: "♟"
};

let gameOn = true;
let currentBoard = create2DArray(8);
let turn = "white";
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

            currentBoard[i][j] = chessSquare.textContent;

            chessSquare.addEventListener('click', () => {
            selectPiece(i,j,chessSquare.textContent)
            }
            );

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

function selectPiece(i , j , piece )
{
    if (gameOn == false)
    {
        return ;
    }

    if (isSomethingSelected() == false && getPieceColor(piece) != turn)//works for selecting either empty spaces or non-turn pieces
    {
        return ;
    }

    else if (piece == " " && arrayExistsIn2dArray(moves , i , j) )
    {
        movePiece(i,j);
    }

    else if(isSomethingSelected() == true && getPieceColor(piece) != turn)
    {
        if (arrayExistsIn2dArray(captureMoves , i , j)){
                movePiece(i,j);
            }
    }

    else{//basically the piece is the colour of the turn
        if (isSomethingSelected() == true){
        cancelSelect();
        }

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
    return "empty";
}

function cancelSelect()
{
    let x = selected[0];
    let y = selected[1];
    setColor(x,y,getID(x,y));    //changed the issomethingselected here , might break !!
    
    for (let index = 0 ; index < moves.length ; index++)
    {
        let boxParent = getID(moves[index][0],moves[index][1]);//removing the move-dots
        boxParent.removeChild(boxParent.lastChild);
    }

    for (let index = 0 ; index < captureMoves.length ; index++)
    {
        let x = captureMoves[index][0];//removing the red squares
        let y = captureMoves[index][1];
        setColor(x,y,getID(x,y));
    }

    moves = [];
    captureMoves = [];//resetting
    selected = [-1 , -1];

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

function pieceMenu(i,j,piece)
{
    switch (piece) {
    
    case chessPiecesMap.b_pawn:
        Pawn(i,j,"black");
        break;

    case chessPiecesMap.w_pawn:
        Pawn(i,j,"white");
        break;

    case chessPiecesMap.b_bishop:
    case chessPiecesMap.w_bishop:
        bishop(i,j);
        break;

    case chessPiecesMap.b_rook:
    case chessPiecesMap.w_rook:
        rook(i,j);
        break;
    
    case chessPiecesMap.b_queen:
    case chessPiecesMap.w_queen:
        queen(i,j);
        break;

    case chessPiecesMap.b_king:
    case chessPiecesMap.w_king:
        king(i,j);
        break;

    case chessPiecesMap.b_knight:
    case chessPiecesMap.w_knight:
        knight(i,j);
        break;
    }
}

function showMoves(i , j , piece)
{
    
    pieceMenu(i,j,piece);

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

function Pawn(i,j,color)
{
    let direct = 1;
    let startingRow = 1;
    if (color == "white")
    {
        direct = -1;
        startingRow = 6;
    }

    let forward = [[i+direct,j]];
    if (i == startingRow)
    {
        forward.push([i+2*direct,j]);
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

    let diagonal = [[i+direct,j-1],[i+direct,j+1]];

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
    return currentBoard[i][j];
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

function isSomethingSelected()
{
    return !EqualArray(nothingSelected,selected);
}

function movePiece(i,j){
    
    let x = selected[0];
    let y = selected[1];
    
    pieceToMove = getPiece(x,y);
    
    cancelSelect();

    let pieceAtDestination = getPiece(i,j);
    currentBoard[x][y] = " ";
    currentBoard[i][j] = pieceToMove;
    
    let kingCoordinates = getCoordinates(getKing(turn));

    if (checkForCheck(kingCoordinates[0],kingCoordinates[1],turn)){
        alert("illegal move by " + turn + " ! You can't keep or place your king in check");
        currentBoard[x][y] = pieceToMove;
        currentBoard[i][j] = pieceAtDestination;
        return ;
    }

    let sourceSquare = getID(x,y);
    sourceSquare.textContent = " ";
    
    let destinationSquare = getID(i,j);
    destinationSquare.textContent = pieceToMove;
    setColor(i,j,destinationSquare);//only needed if we capture 

    if (isEnemyKingAlive() == false)
    {
        gameOn = false;
        alert(turn + " has won the game!");
        return;
    }

    enemyKingCoordinates = getCoordinates(getKing(reverseColor(turn)));

    if (checkForCheck(enemyKingCoordinates[0],enemyKingCoordinates[1],reverseColor(turn))){
        // if (checkForCheckmate() == true){
        //     gameOn = false;
        //     alert(turn + " has won the game!");
        //     return;
        // }
        alert(reverseColor(turn) + " king checked!");
        console.log(reverseColor(turn) + " king checked!");
    }

    moves = [];
    captureMoves = [];
    
    changeTurn();
}

function getCoordinates(piece)
{
    for (let i = 0 ; i < 8 ; i++)
    {
        for (let j = 0 ; j < 8 ; j++)
        {
            if (getPiece(i,j) == piece)
            {
                return [i,j];
            }
        }
    }
}

function changeTurn()
{
    if (turn == "white"){
        turn = "black";
    }

    else if (turn == "black")
    {
        turn = "white";
    }
}

function arrayExistsIn2dArray(twoDimArr , i , j)
{
            let foundMove = false;
            for (let index = 0 ; index < twoDimArr.length ; index++)//can be replaced by checking whether we have a move-dot in there or not
            {
                if (EqualArray(twoDimArr[index],[i,j]))
                {
                    foundMove = true;
                    break;
                }
            }

            return foundMove;
}

function bishop(i,j)
{
    let row = [1 , -1 , 1 , -1];
    let col = [1 , -1 , -1 , 1];

    bishopAndRook(row,col,i,j);
}

function rook(i,j)
{
    let row = [1 , -1 , 0 , 0];
    let col = [0 , 0 , 1 , -1];

    bishopAndRook(row,col,i,j);
}

function queen(i,j)
{
    bishop(i,j);
    rook(i,j);
}

function bishopAndRook(row , col , i , j)
{
    let color = getColor(i,j);

    for (let index = 0 ; index < 4 ; index++){
        let x = i + row[index];
        let y = j + col[index];        

        while(checkObstruction(x , y , color) == 0)
        {
            moves.push([x , y]);
            x += row[index];
            y += col[index];
        }
        if (checkObstruction(x , y, color) == 2)
        {
            captureMoves.push([x, y]);
        }
    }
}

function king(i ,j)
{
    let row = [1 , 1 , 1 , 0 , -1,  -1 , -1 , 0]
    let col = [-1 , 0 , 1 , 1 , 1 , 0 , -1 , -1]

    kingAndKnight(row,col,i,j);
}

function knight(i,j)
{
    let row = [2,2,-1,1,-2,-2,1,-1];
    let col = [-1,1,2,2,1,-1,-2,-2];

    kingAndKnight(row,col,i,j);
}

function kingAndKnight(row , col , i  , j)
{
    let color = getColor(i,j);

    for (let index = 0 ; index < row.length ; index++)
    {
        x = row[index] + i;
        y = col[index] + j;
        
        let typeOfPiece = checkObstruction(x,y,color);

        if (typeOfPiece == 0)
        {
            moves.push([x,y]);
        }
        else if (typeOfPiece == 2)
        {
            captureMoves.push([x,y]);
        }
    }
}

function isEnemyKingAlive()
{
    let kingToCheck =  getKing(reverseColor(turn));

    for (let i = 0 ; i < 8 ; i++)
    {
        for (let j = 0; j < 8 ; j++)
        {
            if (getPiece(i,j) == kingToCheck){
                return true;
            } 
        }
    }

    return false;
}

function checkForCheck(x,y,clr)
{
    
    for (let i = 0 ; i < 8 ; i++)
    {
        for (let j = 0 ; j < 8 ; j++)
        {
            if (getColor(i,j) == clr)
            {
                continue;
            }

            else{
                pieceMenu(i,j,getPiece(i,j));
            }
        }
    }


    let kingChecked = false;

    for (let index = 0 ; index < captureMoves.length ; index++)
    {
        if (EqualArray(captureMoves[index],[x,y]))
        {
            console.log(turn + " king checked");
            kingChecked = true;
            break;
        }
    }

    moves = [];//resetting
    captureMoves = [];

    return kingChecked;
}

function getKing(kingColour)
{
    if (kingColour == "white")
    {
        return chessPiecesMap.w_king;
    }
    if (kingColour == "black")
    {
        return chessPiecesMap.b_king;
    }

}

function reverseColor(color)
{
    if (color == "white")
    {
        return "black";
    }
    return "white";
}

function checkForCheckmate()
{
    for (let i = 0 ; i < 8 ; i++)
    {
        for (let j = 0 ; j < 8 ; j++)
        {
            if (getColor(i,j) == reverseColor(turn))
            {
                let pieceToMove = getPiece(i,j);
                pieceMenu(i,j,pieceToMove);

                let copyMoves = moves;
                
                moves = [];
                captureMoves = [];

                let pieceAtDestination = getPiece(i,j);

                for (let index = 0 ; index < copyMoves.length ; index++){

                    let x = copyMoves[index][0];
                    let y = copyMoves[index][1];

                    currentBoard[i][j] = " ";
                    currentBoard[x][y] = pieceToMove;
                    
                    let kingCoordinates = getCoordinates(getKing(reverseColor(turn)));

                    if (checkForCheck(kingCoordinates[0],kingCoordinates[1],reverseColor(turn)) == false){
                            moves = [];
                            captureMoves = [];

                            return false;
                        }
                    
                                        
                    currentBoard[x][y] = pieceAtDestination;
                    currentBoard[i][j] = pieceToMove;

                }
            }

            moves = [];
            captureMoves = [];

        }
    }

    return true;
}