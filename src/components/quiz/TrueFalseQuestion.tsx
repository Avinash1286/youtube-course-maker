import React from 'react';
import { QuizQuestion } from '@/types/notes';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TrueFalseQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | undefined>(undefined);
  const [showFeedback, setShowFeedback] = React.useState(false);

  // Reset state when question changes
  React.useEffect(() => {
    setSelectedAnswer(undefined);
    setShowFeedback(false);
  }, [question.id]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    onAnswer(answer);
  };

  return (
    <div className="space-y-4 p-6 rounded-xl bg-white shadow-sm border border-learning-100">
      <p className="text-lg font-medium text-learning-800">{question.question}</p>
      <div className="space-y-3">
        {['true', 'false'].map((value) => {
          const isCorrect = value === question.correctAnswer;
          const isSelected = value === selectedAnswer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <div
              key={value}
              onClick={() => !showFeedback && handleAnswer(value)}
              className={`relative flex items-center p-4 rounded-lg border transition-colors cursor-pointer ${
                showCorrect
                  ? 'border-green-200 bg-green-50'
                  : showIncorrect
                  ? 'border-red-200 bg-red-50'
                  : isSelected
                  ? 'border-learning-400 bg-learning-50'
                  : 'border-learning-200 hover:bg-learning-50'
              } ${!showFeedback ? 'hover:border-learning-400' : ''}`}
            >
              <span className="flex-grow capitalize">{value}</span>
              {showFeedback && (isCorrect || isSelected) && (
                <div className="ml-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showFeedback && (
        <div className={`p-4 rounded-lg ${selectedAnswer === question.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`font-medium ${selectedAnswer === question.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
            {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
          </p>
          {selectedAnswer !== question.correctAnswer && (
            <p className="mt-2 text-sm text-gray-600">
              The correct answer is: {question.correctAnswer}
              {question.explanation && <span className="block mt-1">{question.explanation}</span>}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
