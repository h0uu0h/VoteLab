/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./FormPage.module.css";
import searchIcon from "../assets/search.svg";

const SearchModal = ({ initialTerm, onClose }) => {
    const [searchTerm, setSearchTerm] = useState(initialTerm || "");
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/votes");
                if (response.ok) {
                    const allItems = await response.json();
                    const filtered = allItems.filter((item) =>
                        item.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    );
                    setItems(filtered);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (searchTerm) {
            fetchItems();
        }
    }, [searchTerm]);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}>
                <div className={`${styles.searchInputContainer} ${styles.searchInputContainerActive}`}>
                    <img src={searchIcon} style={{ width: "4rem" }} />
                    <input
                        className={`${styles.searchInput} ${styles.searchInputActive}`}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        placeholder="搜索"
                    />
                </div>
                <div className={styles.searchResults}>
                    {items.map((item) => (
                        <div key={item.id}>
                            {item.name} - {item.votes}票
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
