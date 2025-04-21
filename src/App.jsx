import { useEffect, useState } from 'react'
import './App.css'

const API_URL='https://api.frontendexpert.io/api/fe/wordle-words';
const  WORD_LENGTH = 5;

function App() {

  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess]= useState('')
  const [isGameOver, setIsGameOver]= useState(false)


  useEffect(() => {
    const handleType = (event) =>{

      if(isGameOver){
        return;
      }

      if (event.key === 'Enter'){
        if (currentGuess.length !== 5){
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex(val => val == null)]= currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');
        


        const isCorrect = solution === currentGuess;
        if(isCorrect){

          setIsGameOver(true);
        }
        
      }

      if(event.key === 'Backspace'){
        setCurrentGuess(currentGuess.slice(0,-1));

        return;
      }
      


      if(currentGuess.length >= 5){
        return;
      }


      setCurrentGuess(oldGuess => oldGuess + event.key.toLowerCase());

    };

    window.addEventListener('keydown', handleType);

    return () => window.removeEventListener('keydown', handleType);


  },[currentGuess, isGameOver, solution, guesses]);


  useEffect(() => {
    const fetchWord = async () => {
      try {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length )];
      setSolution(randomWord.toLowerCase());
      }catch (error) {
        console.error('Failed to fetch words:', error);
      }


    };

    fetchWord();
    


  },[]);
  

  return (
   
   
    <div className='board'>
    <h1>    Wordle</h1>
      {
        guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex(val => val == null);
          return (
            <Line  
            key={i}
            guess={isCurrentGuess ? currentGuess : guess ?? ''} 
            isFinal={!isCurrentGuess && guess != null}
            solution= {solution}
            />
          );
        })

    }
      
    </div>
  
  );
}

function Line({guess, isFinal, solution}){
  const tiles = [];

  for (let i=0; i< WORD_LENGTH; i++){
    const char = guess[i];
    let className= 'tiles';

    if(isFinal){
      if(char === solution[i]){
        className += ' correct';
      }else if (solution.includes(char)){
        className += ' close'
      }else{
        className += ' incorrect';
      }
    }

    tiles.push(<div key={i} className={className} >{char}</div>)
  }

  return(
    <div className='line'>{tiles}</div>
  )

}

export default App
