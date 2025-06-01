
import React from 'react';
import { QuizSession } from '../types/quiz';
import { Calendar, Clock, Trophy, ArrowLeft } from 'lucide-react';

interface QuizHistoryProps {
  sessions: QuizSession[];
  onBackToHome: () => void;
  onClearHistory: () => void;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ sessions, onBackToHome, onClearHistory }) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageScore = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + (session.score / session.totalQuestions) * 100, 0) / sessions.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Quiz
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz History
            </h1>
            <p className="text-gray-600 text-lg mt-2">Track your progress over time</p>
          </div>
          {sessions.length > 0 && (
            <button
              onClick={onClearHistory}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Trophy className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No quiz attempts yet</h3>
            <p className="text-gray-500 mb-6">Take your first quiz to see your results here!</p>
            <button
              onClick={onBackToHome}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Trophy className="mx-auto mb-3 text-yellow-600" size={32} />
                <div className="text-2xl font-bold text-gray-800">{sessions.length}</div>
                <div className="text-gray-600">Total Attempts</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Calendar className="mx-auto mb-3 text-blue-600" size={32} />
                <div className="text-2xl font-bold text-gray-800">{averageScore.toFixed(1)}%</div>
                <div className="text-gray-600">Average Score</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Clock className="mx-auto mb-3 text-green-600" size={32} />
                <div className="text-2xl font-bold text-gray-800">
                  {Math.max(...sessions.map(s => (s.score / s.totalQuestions) * 100)).toFixed(0)}%
                </div>
                <div className="text-gray-600">Best Score</div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Recent Attempts</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {sessions.slice().reverse().map((session, index) => {
                  const percentage = Math.round((session.score / session.totalQuestions) * 100);
                  return (
                    <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 rounded-full p-3">
                            <Trophy className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              Attempt #{sessions.length - index}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(session.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {formatDuration(session.duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(session.score, session.totalQuestions)}`}>
                            {session.score}/{session.totalQuestions}
                          </div>
                          <div className={`text-sm font-semibold ${getScoreColor(session.score, session.totalQuestions)}`}>
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
