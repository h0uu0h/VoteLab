/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./BarChart.module.css";

const CustomTooltip = ({ value, color, indexValue }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            padding: "8px 12px",
            border: `1px solid ${color}`,
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}>
        <div
            style={{
                width: 12,
                height: 12,
                background: color,
                borderRadius: "2px",
                marginRight: 8,
            }}
        />
        <div>
            <div
                style={{ color: "black", fontWeight: "bold", marginBottom: 4 }}>
                {indexValue}
            </div>
            <div style={{ color: "black", fontSize: 12 }}>票数: {value}</div>
        </div>
    </div>
);

const BarChart = () => {
    const [data, setData] = useState([]);
    const [height, setHeight] = useState(500);

    useEffect(() => {
        const fetchVotes = () => {
            fetch("http://127.0.0.1:8000/api/votes")
                .then((res) => res.json())
                .then((voteItems) => {
                    const formatted = voteItems
                        .map((item) => ({
                            id: item.id,
                            name: item.name,
                            votes: item.votes,
                            color:
                                item.color ||
                                `hsl(${Math.random() * 360}, 70%, 60%)`,
                        }))
                        .sort((a, b) => a.votes - b.votes);
                    setData(formatted);
                    setHeight(formatted.length * 30);
                });
            // console.log("轮询！");
        };
        fetchVotes(); // 初始加载
        const interval = setInterval(fetchVotes, 1000); // 每3秒刷新一次

        return () => clearInterval(interval); // 组件卸载时清理定时器
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>投票数据柱状图</h2>
            <div
                className={styles.chart}
                style={{ height: `${height}px`, minHeight: "400px" }}>
                <ResponsiveBar
                    data={data}
                    keys={["votes"]}
                    indexBy="name"
                    layout="horizontal"
                    margin={{ top: 50, right: 40, bottom: 20, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={({ data }) => data.color}
                    // borderColor={{
                    //     from: "color",
                    //     modifiers: [["darker", 1.6]],
                    // }}
                    axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: "选项",
                        legendPosition: "middle",
                        legendOffset: 32,
                    }}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: "票数",
                        legendPosition: "middle",
                        legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: "color",
                        modifiers: [["darker", 1.6]],
                    }}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    tooltip={CustomTooltip}
                />
            </div>
        </div>
    );
};

export default BarChart;
