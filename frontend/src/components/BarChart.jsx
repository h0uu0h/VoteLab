import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./BarChart.module.css";

const BarChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/votes")
            .then((res) => res.json())
            .then((voteItems) => {
                const formatted = voteItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    votes: item.votes,
                    color:
                        item.color || `hsl(${Math.random() * 360}, 70%, 60%)`,
                }));
                setData(formatted);
            });
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>投票数据柱状图</h2>
            <div className={styles.chart}>
                <ResponsiveBar
                    data={data}
                    keys={["votes"]}
                    indexBy="name"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={({ data }) => data.color}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 1.6]],
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "选项",
                        legendPosition: "middle",
                        legendOffset: 32,
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "票数",
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
                />
            </div>
        </div>
    );
};

export default BarChart;
