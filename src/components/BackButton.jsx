import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      type="back"
      onCLickFake={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Go Back
    </Button>
  );
}

export default BackButton;
