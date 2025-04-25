/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./FormPage.module.css";
import searchIcon from "../assets/search.svg";

const FormPage = ({ onAddNewItem, onSearchFocus }) => {
    const [formData, setFormData] = useState({
        name: "",
        color: "",
        imageId: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const randomId = `id_${Date.now()}_${Math.floor(
            Math.random() * 10000
        )}`;
        try {
            const response = await fetch("http://127.0.0.1:8000/api/vote/new", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: randomId, ...formData, votes: 1 }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                setFormData({ name: "", color: "", imageId: "" });
                if (onAddNewItem) onAddNewItem();
            }
        } catch (error) {
            console.error("Error adding new item:", error);
        }
    };

    return (
        <div className={styles.container}>
            {/* A行: 标题 + 搜索框 + 添加按钮 */}
            <div className={styles.headerRow}>
                <h1 className={styles.title}>来你支持的cp吧~</h1>
                <div className={styles.searchInputContainer}>
                    <img src={searchIcon} alt="" />
                    <input
                        type="text"
                        placeholder="搜索"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                        onFocus={onSearchFocus}
                    />
                </div>
            </div>

            {/* 上传信息表单 */}
            <form onSubmit={handleSubmit} className={styles.inlineForm}>
                <input
                    type="text"
                    name="name"
                    placeholder="名称"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="color"
                    placeholder="颜色 (#81e052)"
                    value={formData.color}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="imageId"
                    placeholder="图片ID"
                    value={formData.imageId}
                    onChange={handleChange}
                />
                <button type="submit" className={styles.submitButton}>
                    上传
                </button>
            </form>
        </div>
    );
};

export default FormPage;
