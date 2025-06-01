
import React, { useState, useEffect } from 'react';
import { quizQuestions } from '../data/questions';
import { QuizState, Answer, QuizSession } from '../types/quiz';
import { useQuizStorage } from '../hooks/useQuizStorage';
import WebcamMonitor from './WebcamMonitor';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizHistory from './QuizHistory';
import { Camera, Play, BookOpen, History, Shield } from 'lucide-react';

type AppView = 'home' | 'quiz' | 'results' | 'history';

const QuizApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    isStarted: false,
    isCompleted: false,
    startTime: 0
  });
  const [webcamPermissionGranted, setWebcamPermissionGranted] = useState(false);
  const [lastSession, setLastSession] = useState<QuizSession | null>(null);
  const { sessions, saveSession, clearSessions } = useQuizStorage();

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: [],
      isStarted: false,
      isCompleted: false,
      startTime: 0
    });
    setWebcamPermissionGranted(false);
  };

  const startQuiz = () => {
    const startTime = Date.now();
    setQuizState({
      currentQuestion: 0,
      answers: [],
      isStarted: true,
      isCompleted: false,
      startTime
    });
    setCurrentView('quiz');
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = quizQuestions[quizState.currentQuestion];
    const newAnswer: Answer = {
      qId: currentQuestion.id,
      selected: answer
    };

    setQuizState(prev => ({
      ...prev,
      answers: [
        ...prev.answers.filter(a => a.qId !== currentQuestion.id),
        newAnswer
      ]
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    }
  };

  const submitQuiz = () => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - quizState.startTime) / 1000);
    
    // Calculate score
    const score = quizState.answers.reduce((total, answer) => {
      const question = quizQuestions.find(q => q.id === answer.qId);
      return total + (question?.correct === answer.selected ? 1 : 0);
    }, 0);

    // Create session
    const session: QuizSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      score,
      totalQuestions: quizQuestions.length,
      answers: quizState.answers,
      duration
    };

    saveSession(session);
    setLastSession(session);
    setQuizState(prev => ({ ...prev, isCompleted: true, endTime }));
    setCurrentView('results');
  };

  const getCurrentAnswer = () => {
    const currentQuestion = quizQuestions[quizState.currentQuestion];
    return quizState.answers.find(a => a.qId === currentQuestion.id)?.selected || '';
  };

  const canProceed = () => {
    return getCurrentAnswer() !== '';
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    setCurrentView('home');
  };

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6">
                  <BookOpen className="text-white" size={48} />
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Secure Quiz App
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Test your React knowledge with our proctored quiz system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <Camera className="mx-auto mb-3 text-blue-600" size={32} />
                <h3 className="font-semibold text-blue-800 mb-2">Webcam Monitoring</h3>
                <p className="text-sm text-blue-600">Your webcam will record during the quiz for security</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <Shield className="mx-auto mb-3 text-green-600" size={32} />
                <h3 className="font-semibold text-green-800 mb-2">Secure Testing</h3>
                <p className="text-sm text-green-600">Complete the quiz in a controlled environment</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <BookOpen className="mx-auto mb-3 text-purple-600" size={32} />
                <h3 className="font-semibold text-purple-800 mb-2">8 Questions</h3>
                <p className="text-sm text-purple-600">Multiple choice questions about React</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={startQuiz}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Play size={24} />
                Start Quiz
              </button>
              
              {sessions.length > 0 && (
                <button
                  onClick={() => setCurrentView('history')}
                  className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <History size={20} />
                  View History ({sessions.length})
                </button>
              )}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This quiz requires camera access for proctoring. Please ensure you're in a quiet, well-lit environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'quiz') {
    if (!webcamPermissionGranted) {
      return (
        <>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <Camera className="mx-auto mb-6 text-blue-600" size={64} />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Camera Access Required</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Please allow camera access to begin the proctored quiz. Your webcam feed will be monitored throughout the test.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    We use your camera to ensure the integrity of the quiz. The feed is only used for monitoring purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <WebcamMonitor isActive={true} onPermissionGranted={setWebcamPermissionGranted} />
        </>
      );
    }

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                React Knowledge Quiz
              </h1>
              <p className="text-gray-600">Choose the best answer for each question</p>
            </div>

            <QuizQuestion
              question={quizQuestions[quizState.currentQuestion]}
              selectedAnswer={getCurrentAnswer()}
              onAnswerSelect={handleAnswerSelect}
              questionNumber={quizState.currentQuestion + 1}
              totalQuestions={quizQuestions.length}
            />

            <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
              <div className="text-sm text-gray-600">
                Question {quizState.currentQuestion + 1} of {quizQuestions.length}
              </div>
              
              <div className="flex gap-4">
                {quizState.currentQuestion < quizQuestions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    disabled={!canProceed()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={!canProceed()}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <WebcamMonitor isActive={true} onPermissionGranted={setWebcamPermissionGranted} />
      </>
    );
  }

  if (currentView === 'results' && lastSession) {
    return (
      <QuizResults
        session={lastSession}
        questions={quizQuestions}
        onRetakeQuiz={handleRetakeQuiz}
        onViewHistory={() => setCurrentView('history')}
      />
    );
  }

  if (currentView === 'history') {
    return (
      <QuizHistory
        sessions={sessions}
        onBackToHome={() => {
          resetQuiz();
          setCurrentView('home');
        }}
        onClearHistory={() => {
          clearSessions();
          setCurrentView('home');
        }}
      />
    );
  }

  return null;
};

export default QuizApp;
