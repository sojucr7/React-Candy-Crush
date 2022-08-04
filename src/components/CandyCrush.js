import './CandyCrush.css'
import Score from './Score'
import { useEffect, useState } from 'react'

function CandyCrush() {

    const colors = [
        'blue-candy.png',
        'red-candy.png',
        'purple-candy.png',
        'orange-candy.png',
        'yellow-candy.png',
        'green-candy.png'
    ]

    const GRID_ROWS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-rows'))

    const GRID_COLUMNS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-columns'))

    const GRID_SIZE = GRID_ROWS * GRID_COLUMNS

    const [grid, setGrid] = useState([])

    const [score, setScore] = useState(0)

    const [draggedItemIndex, setDraggedItemIndex] = useState(-1)

    const BLANK_IMAGE = 'blank.png'

    const INTERVAL = 100

    const SCORE_INCREMENT_BY=1;

    const excludedCandiesInRow = (numberFromEachColumn) => {
        let excluded = []
        for (let i = 0; i < grid.length; i++) {
            let lastColumnOfEachRow = Math.floor(i / GRID_COLUMNS) * GRID_COLUMNS + GRID_COLUMNS
            if (i >= lastColumnOfEachRow - numberFromEachColumn && i <= lastColumnOfEachRow) {
                excluded.push(i)
            }
        }
        return excluded
    }


    const excludedCandiesInColumn = (numberFromEachRow) => {
        let excluded = []
        for (let i = GRID_COLUMNS * (GRID_ROWS - numberFromEachRow); i < grid.length; i++) {
            excluded.push(i)
        }
        return excluded
    }


    const crushMatchOfFourCandiesInARow = () => {
        for (let i = 0; i < GRID_SIZE; i++) {
            if (excludedCandiesInRow(3).includes(i)) {
                continue
            }
            const rowsOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = grid[i]
            if (rowsOfFour.every((row) => grid[row] == decidedColor)) {
                rowsOfFour.forEach((row) => grid[row] = BLANK_IMAGE)
                setScore(prevScore => prevScore + SCORE_INCREMENT_BY);
                return true
            }
        }
    }

    const crushMatchOfThreeCandiesInARow = () => {
        for (let i = 0; i < GRID_SIZE; i++) {
            if (excludedCandiesInRow(2).includes(i)) {
                continue
            }
            const rowsOfThree = [i, i + 1, i + 2]
            const decidedColor = grid[i]
            if (rowsOfThree.every((row) => grid[row] == decidedColor)) {
                rowsOfThree.forEach((row) => grid[row] = BLANK_IMAGE)
                setScore(prevScore => prevScore + SCORE_INCREMENT_BY);
                return true
            }
        }
    }

    const crushMatchOfFourCandiesInAColumn = () => {
        for (let i = 0; i < GRID_SIZE; i++) {
            if (excludedCandiesInColumn(3).includes(i)) {
                continue
            }
            const columnOfFour = [i, i + GRID_COLUMNS, i + GRID_COLUMNS * 2, i + GRID_COLUMNS * 3]
            const decidedColor = grid[i]
            if (columnOfFour.every((column) => grid[column] == decidedColor)) {
                columnOfFour.forEach((row) => grid[row] = BLANK_IMAGE)
                setScore(prevScore => prevScore + SCORE_INCREMENT_BY);
                return true
            }
        }
    }

    const crushMatchOfThreeCandiesInAColumn = () => {
        for (let i = 0; i < GRID_SIZE; i++) {
            if (excludedCandiesInColumn(2).includes(i)) {
                continue
            }
            const columnOfThree = [i, i + GRID_COLUMNS, i + GRID_COLUMNS * 2]
            const decidedColor = grid[i]
            if (columnOfThree.every((column) => grid[column] == decidedColor)) {
                columnOfThree.forEach((row) => grid[row] = BLANK_IMAGE)
                setScore(prevScore => prevScore + SCORE_INCREMENT_BY);
                return true
            }
        }
    }

    const slideDownToEmptySpot = () => {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[j + GRID_COLUMNS] == BLANK_IMAGE) {
                grid[j + GRID_COLUMNS] = grid[j]
                grid[j] = BLANK_IMAGE
            }
        }
    }

    const fillFirstColumnWithNewColor = () => {
        for (let j = 0; j < GRID_COLUMNS; j++) {
            if (grid[j] == BLANK_IMAGE) {
                grid[j] = colors[Math.floor(Math.random() * colors.length)]
            }

        }
    }

    const dragCandy = (event, index) => {
        setDraggedItemIndex(index)
    }

    const dragOverCandy = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const dropCandy = (event) => {

        let targetIndex = parseInt(event.target.dataset.id)

        let droppedIndexRow = Math.floor(targetIndex / GRID_COLUMNS)

        let draggedItemIndexRow = Math.floor(draggedItemIndex / GRID_COLUMNS)

        let validMoves = [
            draggedItemIndex - GRID_COLUMNS,
            draggedItemIndex + GRID_COLUMNS
        ]

        if (Math.floor((draggedItemIndex - 1) / GRID_COLUMNS) == draggedItemIndexRow) {
            validMoves.push(draggedItemIndex - 1)
        }

        if (Math.floor((draggedItemIndex + 1) / GRID_COLUMNS) == draggedItemIndexRow) {
            validMoves.push(draggedItemIndex + 1)
        }

        if (!validMoves.includes(targetIndex)) {
            console.log("Sorry,Not a valid Move")
            return
        }

        let draggedItem = grid[draggedItemIndex]

        let droppedItem = grid[targetIndex]

        grid[draggedItemIndex] = droppedItem

        grid[targetIndex] = draggedItem

        if (
            !crushMatchOfFourCandiesInARow() &&
            !crushMatchOfThreeCandiesInARow() &&
            !crushMatchOfFourCandiesInAColumn() &&
            !crushMatchOfThreeCandiesInAColumn()
        ) {
            console.log("No Match Found,Reverting Back")

            grid[draggedItemIndex] = draggedItem
            grid[targetIndex] = droppedItem
        }
    }

    useEffect(() => {
        let grid = []
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[i] = colors[Math.floor(Math.random() * colors.length)]
        }
        setGrid(grid)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            crushMatchOfFourCandiesInARow()
            crushMatchOfThreeCandiesInARow()
            crushMatchOfFourCandiesInAColumn()
            crushMatchOfThreeCandiesInAColumn()
            slideDownToEmptySpot()
            fillFirstColumnWithNewColor()
            setGrid([...grid])
        }, INTERVAL)
        return () => clearInterval(interval)

    }, [grid])

    return (
        <div className='candy-land'>
            <h1>Candy Crush</h1>
            <div className='candy-land-content'>
                <div className="candy-grid">
                    {grid.map(function (gridItem, i) {
                        return <img key={i} src={gridItem} className='candy'
                            data-id={i}
                            draggable="true"
                            onDragStart={e => dragCandy(e, i)}
                            onDragOver={e => dragOverCandy(e)}
                            onDrop={dropCandy} />
                    })}
                </div>
                <Score score={score}/>
            </div>
        </div>
    )
}

export default CandyCrush