
import React from 'react';
import { Task, Project } from '../types';
import { getTodayStr, formatDateToKey } from '../services/dateService';

interface WeeklySummaryProps {
  tasks: Task[];
  projects: Project[];
  onDateClick: (date: string) => void;
  selectedDate: string;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ tasks, projects, onDateClick, selectedDate }) => {
  const todayStr = getTodayStr();
  
  // 현재 진행 중인 프로젝트 총 개수 (상단 정보용)
  const activeProjectTotal = projects.filter(p => p.status === 'In Progress').length;

  // 오늘부터 7일간의 날짜 리스트 생성
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return formatDateToKey(d);
  });

  const getDaySummary = (date: string) => {
    // 해당 날짜의 미완료 작업만 필터링
    const dayIncompleteTasks = tasks.filter(t => t.date === date && !t.completed);
    
    /**
     * PROJ: 프로젝트 세부 Task (Sub-tasks)
     * - projectId가 존재해야 함 (프로젝트 상세에서 추가된 항목)
     * - 미완료 상태여야 함
     */
    const projectCount = dayIncompleteTasks.filter(t => t.projectId).length;
    
    /**
     * AREAS: 순수 Area 카테고리 Task
     * - category가 'Areas'여야 함
     * - 특정 프로젝트에 소속되지 않아야 함 (projectId 없음)
     * - 미완료 상태여야 함
     */
    const areaCount = dayIncompleteTasks.filter(t => !t.projectId && t.category === 'Areas').length;
    
    return {
      projectCount,
      areaCount
    };
  };

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(d);
  };

  const getDayNum = (dateStr: string) => dateStr.split('-')[2];

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter flex items-center">
          <i className="fas fa-chart-line text-blue-500 mr-2"></i>
          7-Day Weekly Pulse
        </h3>
        <div className="flex items-center space-x-3">
           <span className="text-[10px] font-bold text-slate-400">Next 7 Days</span>
           <div className="flex items-center space-x-1 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
             <span className="text-[9px] font-black text-orange-600 uppercase">Active Proj: {activeProjectTotal}</span>
           </div>
        </div>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {next7Days.map((date) => {
          const summary = getDaySummary(date);
          const isSelected = selectedDate === date;
          const isToday = date === todayStr;

          return (
            <button
              key={date}
              onClick={() => onDateClick(date)}
              className={`flex-shrink-0 w-24 p-3 rounded-2xl border transition-all flex flex-col items-center ${
                isSelected 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105 z-10' 
                  : isToday
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {getDayName(date)}
              </span>
              <span className="text-xl font-black my-1">{getDayNum(date)}</span>
              
              <div className="mt-2 space-y-1 w-full">
                {/* 프로젝트 세부 미완료 Task 카운트 */}
                {summary.projectCount > 0 && (
                  <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-md text-[9px] font-black transition-all ${isSelected ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'}`}>
                    <span>PROJ</span>
                    <span>{summary.projectCount}</span>
                  </div>
                )}
                
                {/* Area 카테고리 미완료 Task 카운트 */}
                {summary.areaCount > 0 && (
                  <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-md text-[9px] font-black transition-all ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    <span>AREAS</span>
                    <span>{summary.areaCount}</span>
                  </div>
                )}
                
                {/* 할 일이 없는 경우 점 표시 */}
                {summary.projectCount === 0 && summary.areaCount === 0 && (
                  <div className="h-4 flex items-center justify-center">
                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/40' : 'bg-slate-200'}`}></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySummary;
