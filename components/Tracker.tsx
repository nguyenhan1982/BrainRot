
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CONTENT_TYPES } from '../constants';
import { analyzeConsumption } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import type { ContentLog, AnalysisResult } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D4FF'];

const Tracker: React.FC = () => {
    const [logs, setLogs] = useState<ContentLog[]>([]);
    const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
    const [duration, setDuration] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addLog = (e: React.FormEvent) => {
        e.preventDefault();
        const durationNum = parseInt(duration, 10);
        if (!durationNum || durationNum <= 0) return;

        const newLog: ContentLog = {
            id: Date.now().toString(),
            type: contentType,
            duration: durationNum,
            date: new Date().toISOString().split('T')[0],
        };
        setLogs([...logs, newLog]);
        setDuration('');
    };

    const handleAnalyze = async () => {
        if (logs.length === 0) return;
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeConsumption(logs);
            if (result) {
                setAnalysisResult(result);
            } else {
                setError('Không thể phân tích dữ liệu. Vui lòng thử lại.');
            }
        } catch (e) {
            setError('Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const chartData = useMemo(() => {
        const dataMap = new Map<string, number>();
        logs.forEach(log => {
            dataMap.set(log.type, (dataMap.get(log.type) || 0) + log.duration);
        });
        return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
    }, [logs]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 {/* Input Form */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-sky-600 dark:text-sky-400">Ghi Nhật Ký</h2>
                    <form onSubmit={addLog} className="space-y-4">
                        <div>
                            <label htmlFor="contentType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Loại nội dung</label>
                            <select
                                id="contentType"
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700"
                            >
                                {CONTENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Thời lượng (phút)</label>
                            <input
                                type="number"
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="VD: 30"
                                className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700"
                            />
                        </div>
                        <button type="submit" className="w-full bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow">Thêm</button>
                    </form>
                </div>

                {/* Log List */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-bold mb-3">Nhật ký hôm nay</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {logs.length === 0 ? (
                            <p className="text-slate-500">Chưa có mục nào.</p>
                        ) : (
                            logs.map(log => (
                                <div key={log.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded">
                                    <span className="text-sm truncate mr-2">{log.type}</span>
                                    <span className="font-semibold text-sm whitespace-nowrap">{log.duration} phút</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-sky-600 dark:text-sky-400">Phân Tích & Biểu Đồ</h2>
                {logs.length > 0 ? (
                    <div className="h-64 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">
                        <p>Thêm nhật ký để xem biểu đồ.</p>
                    </div>
                )}
                
                <div className="text-center mb-4">
                    <button onClick={handleAnalyze} disabled={logs.length === 0 || isLoading} className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow disabled:bg-slate-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Đang phân tích...' : 'Phân Tích với AI'}
                    </button>
                </div>

                {isLoading && <div className="flex justify-center mt-4"><LoadingSpinner /></div>}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                
                {analysisResult && (
                    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4 animate-fade-in">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Mức Độ Tiềm Năng "Thối Não"</h3>
                            <p className="text-3xl font-bold text-sky-500">{analysisResult.overallScore}/100</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700 dark:text-slate-200">Nhận định của AI:</h4>
                            <p className="mt-1 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-slate-600 dark:text-slate-300">{analysisResult.analysis}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700 dark:text-slate-200">Gợi ý cho bạn:</h4>
                             <ul className="mt-1 list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                                {analysisResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tracker;
