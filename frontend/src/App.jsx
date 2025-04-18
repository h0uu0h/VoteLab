/* eslint-disable no-unused-vars */
import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Treemap from "./components/Treemap";
import BarChart from "./components/BarChart";
import FormPage from "./components/FormPage";

const App = () => {
    const handleAddNewItem = () => {
        console.log("New item added, refresh data if needed");
    };

    return (
        <ReactFullpage
            plugins={["Navigation"]}
            scrollingSpeed={800}
            scrollOverflow={true} // 允许内容溢出时滚动
            navigation
            navigationOptions={{
                activeColor: "#ff5722", // 激活状态颜色
                inactiveColor: "#888", // 未激活状态颜色
                activeBorderColor: "transparent", // 边框颜色
            }}
            navigationTooltips={["表单", "树状图", "柱状图"]}
            anchors={["treemap", "barchart", "form"]}
            // 默认打开第二个锚点对应的页面
            initialAnchor="barchart"
            render={({ state, fullpageApi }) => {
                return (
                    <ReactFullpage.Wrapper>
                        <div className="section">
                            <div className="slide">
                                <FormPage onAddNewItem={handleAddNewItem} />
                            </div>
                        </div>
                        <div className="section">
                            <div className="slide">
                                <Treemap />
                            </div>
                        </div>
                        <div className="section">
                            <div className="slide">
                                <BarChart />
                            </div>
                        </div>
                    </ReactFullpage.Wrapper>
                );
            }}
        />
    );
};

export default App;
