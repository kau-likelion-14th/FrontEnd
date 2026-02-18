import React, {useEffect, useState} from "react";
import StatCard from "./StatCard";
import { get } from "../../Api";
import Config from "../../Config";

const Status = () => {
  const [stats, setStats] = useState([
    { icon: "🔥", title: "연속 달성일", statistics: {value: 0, unit: "일"} },
    { icon: "🎯", title: "최근 30일 달성률", statistics: {value: 0, unit: "%"} },
    { icon: "⭐", title: "가장 많이 완료한 요일", statistics: {value: "토요일", unit: ""}}
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await get(Config.STATISTICS.GET);
        setStats([
          { icon: "🔥", title: "연속 달성일", statistics: {value: response.consecutiveDays, unit: "일"} },
          { icon: "🎯", title: "최근 30일 달성률", statistics: {value: response.achievementRate, unit: "%"} },
          { icon: "⭐", title: "가장 많이 완료한 요일", statistics: {value: response.mostCompletedDay, unit: ""}}
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="status-container">
      {stats.map((stats, idx) => (
        <StatCard 
          key={idx} 
          stats={stats}
        />
      ))}
    </div>
  );
};

export default Status;