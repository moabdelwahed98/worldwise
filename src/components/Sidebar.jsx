import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import { useCities } from "../contexts/CitiesContext";

function Sidebar() {
  const { error } = useCities();

  return (
    <div className={styles.sidebar}>
      <Logo />
      {!error && (
        <>
          <AppNav />
          <Outlet />
        </>
      )}
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWise Inc.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
