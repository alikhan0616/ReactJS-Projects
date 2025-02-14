import Header from "./components/Header.jsx"
import { getFarewellText } from "./utils.js"
import { languages } from "./languages.js"
import { getGameWord } from "./utils.js"
import { useState } from "react"
import { useEffect } from "react"
import Confetti from "react-confetti"
import clsx from "clsx"

export default function App() {

    const [currentWord , setCurrentWord] = useState(() => getGameWord())
    const [guessLetter , setGuessLetter] = useState([])

    
    const wrongGuessCount = guessLetter.filter(lang => !currentWord.includes(lang.toLowerCase())).length
    const isGameWon = currentWord.split("").every(letter => guessLetter.includes(letter.toUpperCase()))
    
    const isGameLost = wrongGuessCount >= languages.length -1
    const isGameOver = isGameWon || isGameLost
    const lastGuessLetter = guessLetter[guessLetter.length - 1]
    const isLastGuessIncorrect  = lastGuessLetter && !currentWord.includes(lastGuessLetter.toLowerCase())
    
    
    
    const alphabets = "abcdefghijklmnopqrstuvwxyz"
    
    const listAllLanguages = languages.map( (language, index) => {
        const wordLost = wrongGuessCount > 0
        const isLost = wordLost && index <= wrongGuessCount-1;
        const className = clsx("lang", { wrong: isLost });
        return (
            <p style = {{
                backgroundColor: language.backgroundColor,
                color: language.color
            }} key= {language.name} className= {className}>{language.name}</p>
        )
    })      

    
    useEffect(() => {
        if(isGameOver) {
            document.body.classList.add("scroll-enabled")
        } else {
            document.body.classList.remove("scroll-enabled")
        }
    } , [isGameOver])
    
    const listWordLetters = currentWord.split("").map( (char , index) => { 
        const className = clsx(isGameLost && !guessLetter.includes(char.toUpperCase()) && "missing-letters")
        return <span key={index} className={className}>
            {(guessLetter.includes(char.toUpperCase()) || isGameLost)? char.toUpperCase() : ""}
            </span>
    })
    
    const listKeyBoard = alphabets.split("").map((char, index) => {
        
        const isGuessed = guessLetter.includes(char.toUpperCase())
        const isRight = isGuessed && currentWord.toUpperCase().includes(char.toUpperCase())
        const isWrong = isGuessed && !currentWord.toUpperCase().includes(char.toUpperCase())
        const nameClass = clsx({
            correct: isRight,
            incorrect: isWrong,
            gameOver: isGameOver
        })
        return ( <button 
            onClick={() => guessHandle(char.toUpperCase())} 
            className = {nameClass}
            key={index} aria-disabled = {isGameOver} aria-label={`Letter: ${char}`} >
            {char.toUpperCase()}</button>
        ) 
    })
    const gameStatusClass = clsx("msg-box", {
        won: isGameWon,
        lost: isGameLost,
        farewellMsg: (!isGameLost && isLastGuessIncorrect)
    })
    
    function newGame(){
        setCurrentWord(getGameWord())
        setGuessLetter([])
    }
  

    function guessHandle(char){
        setGuessLetter(prevLetters => 
            prevLetters.includes(char) ? prevLetters : [...prevLetters , char]
        )
    }
    function renderGameStatus(){
        if(!isGameOver && isLastGuessIncorrect){
            return (
                <p className="farewell">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
            )
        } if(isGameWon){
            return (
                    <>
                    <h3 id="top-text">You Won!</h3>
                    <p id="bottom-text">Well done! 🎉</p>
                    </> )
        } if(isGameLost){
            return (
                    <>
                    <h3 id="top-text">Game Over!</h3>
                    <p id="bottom-text">You lose! Better start learning Assembly 😭</p>
                    </>
                    )
        } else return null
    }
    return(
        <main>
        {isGameWon && <Confetti
        recycle={false} 
        numberOfPieces={1000} 
        width={window.innerWidth}
        height={window.innerHeight}
         />}
        <Header />
        <div className={gameStatusClass} aria-live= "polite" role="game status">{renderGameStatus()}</div>
        <div className="languages-box">{listAllLanguages}</div>
        <div className="letter-boxes">{listWordLetters}</div>
        <div className="key-board">{listKeyBoard}</div>
        {isGameOver && 
        <div className="newgame-btn">
            <button
            onClick={newGame} >
                New Game</button> </div> }
        </main>
    )
}