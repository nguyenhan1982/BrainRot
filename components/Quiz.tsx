
import React, { useState, useCallback, useEffect } from 'react';
import { generateQuizQuestions, evaluateQuiz } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import type { QuizQuestion } from '../types';

type QuizStatus = 'not_started' | 'in_progress' | 'finished';

const Quiz: React.FC = () => {
    const [status, setStatus] = useState<QuizStatus>('not_started');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startQuiz = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setStatus('in_progress');
        const fetchedQuestions = await generateQuizQuestions();
        if (fetchedQuestions && fetchedQuestions.length > 0) {
            setQuestions(fetchedQuestions);
            setCurrentQuestionIndex(0);
            setUserAnswers([]);
            setScore(0);
            setFeedback('');
        } else {
            setError('Không thể tải câu hỏi. Vui lòng thử lại.');
            setStatus('not_started');
        }
        setIsLoading(false);
    }, []);

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...userAnswers, answerIndex];
        setUserAnswers(newAnswers);

        if (answerIndex === questions[currentQuestionIndex].correctAnswerIndex) {
            setScore(prev => prev + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setStatus('finished');
        }
    };
    
    useEffect(() => {
        if (status === 'finished') {
            const fetchFeedback = async () => {
                setIsLoading(true);
                const result = await evaluateQuiz(score, questions.length);
                setFeedback(result || 'Không thể nhận phản hồi.');
                setIsLoading(false);
            };
            fetchFeedback();
        }
    }, [status, score, questions.length]);


    const resetQuiz = () => {
        setStatus('not_started');
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setScore(0);
        setFeedback('');
    };

    if (isLoading && status !== 'finished') {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[300px]">
                <LoadingSpinner />
                <p className="mt-4 text-slate-600 dark:text-slate-300">Đang chuẩn bị câu hỏi...</p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={startQuiz} className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors">Thử lại</button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-sky-600 dark:text-sky-400">Trắc Nghiệm Nhận Diện</h2>
            {status === 'not_started' && (
                <div className="text-center">
                    <p className="mb-6 text-slate-600 dark:text-slate-300">Kiểm tra khả năng nhận diện các loại nội dung "thối não" của bạn qua một bài trắc nghiệm ngắn.</p>
                    <button onClick={startQuiz} className="bg-sky-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow-md">
                        Bắt đầu
                    </button>
                </div>
            )}

            {status === 'in_progress' && questions.length > 0 && (
                <div>
                    <div className="mb-4 text-sm text-slate-500">
                        Câu {currentQuestionIndex + 1} / {questions.length}
                    </div>
                    <p className="text-lg font-semibold mb-6 text-slate-700 dark:text-slate-200">{questions[currentQuestionIndex].question}</p>
                    <div className="space-y-3">
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className="w-full text-left p-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {status === 'finished' && (
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Hoàn thành!</h3>
                    <p className="text-2xl font-bold mb-4 text-emerald-500">Điểm của bạn: {score} / {questions.length}</p>
                    {isLoading ? (
                         <div className="flex justify-center p-4"><LoadingSpinner /></div>
                    ) : (
                        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg my-4 text-slate-700 dark:text-slate-200">
                           <p>{feedback}</p>
                        </div>
                    )}
                    <button onClick={resetQuiz} className="bg-sky-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow-md mt-4">
                        Làm lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
