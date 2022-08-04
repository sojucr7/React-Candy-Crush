import { useEffect, useState } from 'react'
import './CandyCrush.css'

function CandyCrush() {

    const colors = [
        'red',
        'green',
        'blue',
        'pink',
        'purple',
        'yellow',
        'orange',
    ]

    const GRID_ROWS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-rows'))

    const GRID_COLUMNS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-columns'))

    const GRID_SIZE = GRID_ROWS * GRID_COLUMNS

    const [grid, setGrid] = useState([])

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
                rowsOfFour.forEach((row) => grid[row] = '')
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
                rowsOfThree.forEach((row) => grid[row] = '')
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
                columnOfFour.forEach((row) => grid[row] = '')
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
                columnOfThree.forEach((row) => grid[row] = '')
            }
        }
    }

    const slideDownToEmptySpot = () => {
        for (let j = 0; j < GRID_COLUMNS; j++) {
            let blankRows = []
            for (let i = GRID_ROWS - 1; i >= 0; i--) {
                if (grid[i * GRID_COLUMNS + j]) {
                    let emptyItem = blankRows.shift()
                    if (emptyItem) {
                        grid[emptyItem] = grid[i * GRID_COLUMNS + j]
                        grid[i * GRID_COLUMNS + j]='';
                        blankRows.push(i * GRID_COLUMNS + j)
                    }
                }
                else {
                    blankRows.push(i * GRID_COLUMNS + j)
                }
               
            }
            blankRows.forEach((blankRow) => grid[blankRow] = colors[Math.floor(Math.random() * colors.length)])
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
            setGrid([...grid])
        },500)
        return () => clearInterval(interval)

    }, [grid])

    return (
        <div className="candy-grid">
            {grid.map(function (gridItem, i) {
                return <div key={i} className='candy' style={{ background: gridItem }}></div>
            })}
        </div>
    )
}

export default CandyCrush