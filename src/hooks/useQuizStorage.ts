
import { useState, useEffect } from 'react';
import { QuizSession } from '../types/quiz';

export const useQuizStorage = () => {
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    const storedSessions = localStorage.getItem('quizSessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  const saveSession = (session: QuizSession) => {
    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    localStorage.setItem('quizSessions', JSON.stringify(updatedSessions));
  };

  const clearSessions = () => {
    setSessions([]);
    localStorage.removeItem('quizSessions');
  };

  return { sessions, saveSession, clearSessions };
};
