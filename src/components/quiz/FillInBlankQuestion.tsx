import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from '@/types/notes';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FillInBlankQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
}

export const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = React.useState<string>('');
  const [showFeedback, setShowFeedback] = React.useState(false);

  // Reset state when question changes
  React.useEffect(() => {
    setAnswer('');
    setShowFeedback(false);
  }, [question.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value;
    setAnswer(newAnswer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedback(true);
    onAnswer(answer);
  };

  const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

  return (
    <div className="space-y-4 p-6 rounded-xl bg-white shadow-sm border border-learning-100">
      <p className="text-lg font-medium text-learning-800">{question.question}</p>
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Type your answer here..."
            value={answer}
            onChange={handleChange}
            className={`pr-10 ${
              showFeedback
                ? isCorrect
                  ? 'border-green-500 focus-visible:ring-green-500'
                  : 'border-red-500 focus-visible:ring-red-500'
                : ''
            }`}
          />
          {showFeedback && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {!showFeedback && (
          <Button onClick={handleSubmit} className="w-full">
            Submit Answer
          </Button>
        )}
        {showFeedback && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {isCorrect 
                ? `Well done! "${question.correctAnswer}" is the correct answer.`
                : `The correct answer is "${question.correctAnswer}". ${question.explanation || ''}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
