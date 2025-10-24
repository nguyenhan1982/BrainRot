
import React, { useState, useCallback } from 'react';
import { generateDefinition } from '../services/geminiService';
import { BRAIN_ROT_DEFINITIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import type { DefinitionResult } from '../types';

const Definitions: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [definition, setDefinition] = useState<DefinitionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = useCallback(async (topicKey: string, topicName: string) => {
    if (selectedTopic === topicKey) {
        setSelectedTopic(null);
        setDefinition(null);
        return;
    }
    setSelectedTopic(topicKey);
    setIsLoading(true);
    setError(null);
    setDefinition(null);

    try {
      const result = await generateDefinition(topicName);
      if (result) {
        setDefinition(result);
      } else {
        setError('Không thể lấy định nghĩa. Vui lòng thử lại.');
      }
    } catch (e) {
      setError('Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTopic]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-sky-600 dark:text-sky-400">Hiểu Về Nội Dung "Thối Não"</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Chọn một chủ đề bên dưới để xem định nghĩa chi tiết, ví dụ minh họa và tìm hiểu tại sao chúng có thể ảnh hưởng tiêu cực đến tư duy của bạn.
      </p>
      <div className="space-y-4">
        {BRAIN_ROT_DEFINITIONS.map((topic) => (
          <div key={topic.key} className="border border-slate-200 dark:border-slate-700 rounded-lg">
            <button
              onClick={() => fetchDefinition(topic.key, topic.name)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="font-semibold">{topic.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${selectedTopic === topic.key ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {selectedTopic === topic.key && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                {isLoading && <div className="flex justify-center p-4"><LoadingSpinner /></div>}
                {error && <p className="text-red-500">{error}</p>}
                {definition && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Định nghĩa</h3>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{definition.definition}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Ví dụ</h3>
                      <ul className="mt-1 list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                        {definition.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Definitions;
