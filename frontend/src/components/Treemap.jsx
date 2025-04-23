/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import styles from "./Treemap.module.css";
import voteIcon from "../assets/thumb_up.svg";

// 单个投票项组件
const VoteItem = ({ node, voteHandler }) => {
    const { x, y, width, height, data, isParent } = node;
    const isRoot = isParent === true;
    const imageUrl = `/src/assets/${data.imageId}.jpg`;
    const WorH = height > width;
    const shouldShowLabel = node.width > 36 && node.height > 36;
    console.log(node);
    console.log(imageUrl);
    return (
        <>
            {shouldShowLabel && (
                <foreignObject x={x} y={y} width={width} height={height} >
                    <div
                        className={`${styles.voteItem} ${
                            isRoot ? styles.rootNode : ""
                        }`}
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: WorH ? "100% auto" : "auto 100%",
                            backgroundRepeat: "repeat",
                            backgroundPosition: "center",
                            backgroundColor: data.color || "#000",
                        }}
                        onClick={() => console.log("Clicked", node.data)}>
                        <div
                            style={{
                                alignSelf: "flex-start",
                                fontWeight: "bold",
                                zIndex: "2",
                            }}>
                            {data.name}
                        </div>
                        {!isRoot && (
                            <button
                                className={styles.voteBtn}
                                onClick={() => voteHandler(data.id)}>
                                <img
                                    className={styles.voteIcon}
                                    src={voteIcon}
                                    alt=""
                                />
                                <span className={styles.voteCount}>
                                    {data.value}
                                </span>
                            </button>
                        )}
                    </div>
                </foreignObject>
            )}
        </>
    );
};

// 树图页面组件
const Treemap = () => {
    const [data, setData] = useState({
        name: "root",
        children: [],
    });

    useEffect(() => {
        // 从 FastAPI 获取投票数据
        fetch("http://127.0.0.1:8000/api/votes")
            .then((res) => res.json())
            .then((voteItems) => {
                const formatted = voteItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    value: item.votes,
                    color:
                        item.color || `hsl(${Math.random() * 360}, 70%, 60%)`,
                    imageId: item.imageId || null, // 新增图片字段
                }));
                setData({ name: "最受欢迎的cp~", children: formatted });
            });
    }, []);

    const handleVote = (id) => {
        // 向 FastAPI 发送投票请求
        fetch(`http://127.0.0.1:8000/api/vote/${id}`, { method: "POST" }).then(
            () => {
                // 更新树图数据，增加票数
                setData((prev) => {
                    const newChildren = prev.children.map((child) =>
                        child.id === id
                            ? { ...child, value: child.value + 1 }
                            : child
                    );
                    return { ...prev, children: newChildren };
                });
            }
        );
    };

    return (
        <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
            <ResponsiveTreeMap
                data={data}
                identity="name"
                value="value"
                margin={{ top: 10, rig32ht: 10, bottom: 10, left: 10 }}
                nodeComponent={(props) => (
                    <VoteItem node={props.node} voteHandler={handleVote} />
                )}
            />
        </div>
    );
};

export default Treemap;
