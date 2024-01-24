import styles from "./Button.module.css";
import PropTypes from "prop-types";

Button.propTypes = {
  onCLickFake: PropTypes.func,
  type: PropTypes.string,
};

function Button({ children, onCLickFake, type }) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onCLickFake}>
      {children}
    </button>
  );
}

export default Button;
