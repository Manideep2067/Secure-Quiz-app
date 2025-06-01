
import React from 'react';
import { QuizSession, Question, Answer } from '../types/quiz';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

interface QuizResultsProps {
  session: QuizSession;
  questions: Question[];
  onRetakeQuiz: () => void;
  onViewHistory: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  session, 
  questions, 
  onRetakeQuiz, 
  onViewHistory 
}) => {
  const percentage = Math.round((session.score / session.totalQuestions) * 100);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Good effort!';
    if (percentage >= 60) return 'Keep practicing!';
    return 'Consider reviewing the material.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Quiz Complete!
          </h1>
          <p className="text-gray-600 text-lg">Here are your results</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold ${getScoreColor(percentage)} mb-2`}>
              {session.score}/{session.totalQuestions}
            </div>
            <div className={`text-3xl font-semibold ${getScoreColor(percentage)} mb-2`}>
              {percentage}%
            </div>
            <p className="text-xl text-gray-600">{getScoreMessage(percentage)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="mx-auto mb-2 text-blue-600" size={24} />
              <div className="font-semibold text-blue-800">Duration</div>
              <div className="text-blue-600">{formatDuration(session.duration)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle className="mx-auto mb-2 text-green-600" size={24} />
              <div className="font-semibold text-green-800">Correct</div>
              <div className="text-green-600">{session.score} questions</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Calendar className="mx-auto mb-2 text-purple-600" size={24} />
              <div className="font-semibold text-purple-800">Completed</div>
              <div className="text-purple-600">
                {new Date(session.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = session.answers.find(a => a.qId === question.id);
              const isCorrect = userAnswer?.selected === question.correct;
              
              return (
                <div key={question.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="text-sm space-y-1">
                        <div className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Your answer: {userAnswer?.selected || 'No answer'}
                        </div>
                        {!isCorrect && (
                          <div className="text-green-600">
                            Correct answer: {question.correct}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeQuiz}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Retake Quiz
          </button>
          <button
            onClick={onViewHistory}
            className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
