import styles from "./PopupError.module.css";
function PopupError({ error }) {
  return (
    <div className={styles.popup}>
      <span className={styles.emoji}>🧨 </span>
      <span className={styles.error}> {error}</span>
    </div>
  );
}

export default PopupError;
