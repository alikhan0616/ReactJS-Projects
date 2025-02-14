import Die from "./Containers/Die.jsx"
import { useState , useRef , useEffect } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"



export default function App() {

    const [allDice , setDice] = useState(() => generateAllnewDice())

    const buttonRef = useRef(null)

    const gameWon =  allDice.every(die => die.isHeld) &&
    allDice.every(die => die.value === allDice[0].value) 

    useEffect(() => {
        if(gameWon) {
            buttonRef.current.focus()
        }
    } , [gameWon])
   

    function generateAllnewDice() {
        const dice = [];
        for(let i = 0 ; i < 10   ; i++){
            dice.push({
                value: (Math.floor(Math.random() * ( 6 - 1 + 1)) + 1),
                isHeld: false,
                id: nanoid()
        })
    }
        return dice;
    }
    
    function hold(id) {
       setDice(prevDice => prevDice.map(item => 
         item.id === id ? {
            ...item, isHeld: !item.isHeld 
        } : item 
        ))
    }

    function getNewDice(){
        if (gameWon){
            setDice(generateAllnewDice)
        } else {
        setDice(prevDice => prevDice.map(die => 
            !die.isHeld ? {
                ...die, value: (Math.floor(Math.random() * ( 6 - 1 + 1)) + 1)
            } : die
        )) }
    }



const listDice = allDice.map( (dieObj) => {
    return <Die 
     key = {dieObj.id} 
     value = {dieObj.value} 
     isHeld = {dieObj.isHeld}
     hold = {() => hold(dieObj.id)}
    />
    })
    return (
        <main>
            {gameWon && <Confetti />}
            <h1 className="Title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {listDice}
            </div>

            <button ref={buttonRef}  id="roll-btn" onClick= {getNewDice}  >{gameWon ? "New Game" : "Roll"}</button>
        </main>
    )
}