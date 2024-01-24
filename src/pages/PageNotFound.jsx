import styles from "./PageNotFound.module.css";

export default function PageNotFound() {
  return (
    <div className={styles["not-found"]}>
      <h1>☹️ 404 ERROR</h1>
      <h2>Page not found</h2>
    </div>
  );
}
