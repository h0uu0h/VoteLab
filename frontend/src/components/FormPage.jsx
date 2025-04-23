import { useState } from "react";
import styles from "./FormPage.module.css";

// eslint-disable-next-line react/prop-types
const FormPage = ({ onAddNewItem }) => {
    const [formData, setFormData] = useState({ name: "", color: "", imageId: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false); // 控制弹窗显示

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/vote/new", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, votes: 0 }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                setFormData({ name: "", color: "", imageId: "" });
                setShowModal(false);
                if (onAddNewItem) onAddNewItem();
            }
        } catch (error) {
            console.error("Error adding new item:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/votes");
            if (response.ok) {
                const allItems = await response.json();
                const filteredItems = allItems.filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setItems(filteredItems);
            }
        } catch (error) {
            console.error("Error searching items:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h2 className={styles.title}>搜索选项</h2>
                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="搜索选项..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearch} className={styles.searchButton}>
                        搜索
                    </button>
                </div>

                {items.length > 0 && (
                    <div className={styles.searchResults}>
                        {/* <h3>搜索结果:</h3> */}
                        <ul>
                            {items.map((item) => (
                                <li key={item.id} style={{ color: item.color }}>
                                    {item.name} - {item.votes}票
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button onClick={() => setShowModal(true)} className={styles.toggleFormButton}>
                    添加新选项
                </button>
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>添加新选项</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">名称:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="color">颜色 (HSL格式):</label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="例如: #81e052"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="imageId">图片ID:</label>
                                <input
                                    type="text"
                                    id="imageId"
                                    name="imageId"
                                    value={formData.imageId}
                                    onChange={handleChange}
                                    placeholder="图片文件名(不带扩展名)"
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.submitButton}>
                                    提交
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className={styles.cancelButton}
                                >
                                    取消
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormPage;
