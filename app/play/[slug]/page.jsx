"use client";
import { useState, useEffect } from 'react';

const PlayPage = () => {
  const [quizInstance, setQuizInstance] = useState({
    status: 'waiting',
    teams: [],
    currentQuestion: null,
    leaderboard: [],
  });
  const [buzzerDisabled, setBuzzerDisabled] = useState(false);

  useEffect(() => {
    // Simulate fetching quiz instance data
    setTimeout(() => {
      setQuizInstance({
        status: 'waiting',
        teams: [{ name: 'Team A' }, { name: 'Team B' }],
        currentQuestion: null,
        leaderboard: [],
      });
    }, 1000);

    // Simulate status update to 'get_ready'
    setTimeout(() => {
      setQuizInstance((prevState) => ({
        ...prevState,
        status: 'get_ready',
      }));
    }, 3000);

    // Simulate status update to 'question'
    setTimeout(() => {
      setQuizInstance((prevState) => ({
        ...prevState,
        status: 'question',
        currentQuestion: { id: 1, text: 'What is the capital of France?', type: 'select_answer' },
      }));
    }, 6000);

    // Simulate status update to 'leaderboard'
    setTimeout(() => {
      setQuizInstance((prevState) => ({
        ...prevState,
        status: 'leaderboard',
        leaderboard: [
          { name: 'Team A', score: 10 },
          { name: 'Team B', score: 5 },
        ],
      }));
    }, 10000);
  }, []);

  const handleBuzzerPress = () => {
    setBuzzerDisabled(true);
    // Simulate sending buzzer press event
    setTimeout(() => {
      setQuizInstance((prevState) => ({
        ...prevState,
        status: 'question',
        currentQuestion: null, // Clear the question after buzzing in
      }));
    }, 500);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      {quizInstance.status === 'waiting' && (
        <div>
          <h1>Waiting for quiz to start...</h1>
          <div className="spinner"></div>
          <p>Teams Joined:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {quizInstance.teams.map((team, index) => (
              <div key={index} style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px' }}>
                <p>{team.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {quizInstance.status === 'get_ready' && (
        <div>
          <h1>Get Ready!</h1>
          <p>The quiz will start in 3 seconds...</p>
        </div>
      )}

      {quizInstance.status === 'question' && quizInstance.currentQuestion && (
        <div>
          <h1>{quizInstance.currentQuestion.text}</h1>
          {quizInstance.currentQuestion.type === 'select_answer' || quizInstance.currentQuestion.type === 'type_answer' ? (
            <p>Answer the question...</p>
          ) : (
            <button
              onClick={handleBuzzerPress}
              disabled={buzzerDisabled}
              style={{ fontSize: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Buzz In!
            </button>
          )}
        </div>
      )}

      {quizInstance.status === 'leaderboard' && (
        <div>
          <h1>Leaderboard</h1>
          {quizInstance.leaderboard.map((team, index) => (
            <div key={index} style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <p>{index + 1}. {team.name}</p>
              <p>{team.score} points</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayPage;
