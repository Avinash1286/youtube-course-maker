import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MCQQuestion } from './quiz/MCQQuestion';
import { TrueFalseQuestion } from './quiz/TrueFalseQuestion';
import { FillInBlankQuestion } from './quiz/FillInBlankQuestion';
import { InteractiveNotes as InteractiveNotesType, QuizQuestion } from '@/types/notes';
import { BookOpen, Lightbulb, ScrollText } from 'lucide-react';
import { cn } from "@/lib/utils";

interface InteractiveNotesProps {
  notes: InteractiveNotesType;
}

interface QuestionProgress {
  id: string;
  isCorrect: boolean;
  answered: boolean;
}

export const InteractiveNotes: React.FC<InteractiveNotesProps> = ({ notes }) => {
  const [questionProgress, setQuestionProgress] = React.useState<{ [key: string]: QuestionProgress }>({});
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const notesIdRef = React.useRef<string | null>(null);

  // Reset states when notes change
  React.useEffect(() => {
    // Generate a unique ID for the current notes
    const currentNotesId = notes.sections.map(s => s.id).join('-');
    
    // Only reset if the notes have changed
    if (notesIdRef.current !== currentNotesId) {
      notesIdRef.current = currentNotesId;
      setActiveSection(null);
      
      // Reset question progress
      const initialProgress = notes.sections.reduce((acc, section) => {
        section.questions.forEach(question => {
          acc[question.id] = {
            id: question.id,
            isCorrect: false,
            answered: false
          };
        });
        return acc;
      }, {} as { [key: string]: QuestionProgress });
      
      setQuestionProgress(initialProgress);
    }
  }, [notes]);

  const handleAnswer = (questionId: string, answer: string, isCorrect: boolean) => {
    setQuestionProgress(prev => ({
      ...prev,
      [questionId]: {
        id: questionId,
        isCorrect,
        answered: true
      }
    }));
  };

  const renderQuestion = (question: QuizQuestion) => {
    const key = `${question.id}-${notesIdRef.current}`; // Add notes ID to the key
    
    switch (question.type) {
      case 'mcq':
        return (
          <MCQQuestion
            key={key}
            question={question}
            onAnswer={(answer) => {
              const isCorrect = answer === question.correctAnswer;
              handleAnswer(question.id, answer, isCorrect);
            }}
          />
        );
      case 'trueFalse':
        return (
          <TrueFalseQuestion
            key={key}
            question={question}
            onAnswer={(answer) => {
              const isCorrect = answer === question.correctAnswer;
              handleAnswer(question.id, answer, isCorrect);
            }}
          />
        );
      case 'fillInBlank':
        return (
          <FillInBlankQuestion
            key={key}
            question={question}
            onAnswer={(answer) => {
              const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
              handleAnswer(question.id, answer, isCorrect);
            }}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <Card className="bg-gradient-to-br from-learning-50 to-white border-learning-200 transform transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-learning-800">
            <BookOpen className="h-6 w-6" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-learning max-w-none text-learning-700 leading-relaxed">
            {notes.introduction}
          </div>
        </CardContent>
      </Card>

      {/* Section Cards */}
      {notes.sections.map((section) => (
        <Card 
          key={section.id} 
          className={cn(
            "bg-gradient-to-br from-learning-50 to-white border-learning-200 transform transition-all duration-200",
            activeSection === section.id ? "ring-2 ring-learning-200 shadow-lg" : "hover:shadow-md"
          )}
          onClick={() => setActiveSection(section.id)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-learning-800">
              <ScrollText className="h-6 w-6" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-learning max-w-none text-learning-700 leading-relaxed">
              {section.content}
            </div>
            {section.questions.length > 0 && (
              <div className="space-y-8 mt-6">
                <div className="flex items-center gap-2 text-learning-800 font-semibold">
                  <Lightbulb className="h-5 w-5" />
                  <h3>Practice Questions</h3>
                </div>
                <div className="space-y-8">
                  {section.questions.map((question, index) => (
                    <div key={question.id} className="relative">
                      <div className="absolute -left-8 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-learning-100 text-learning-700 font-semibold">
                        {index + 1}
                      </div>
                      {renderQuestion(question)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
