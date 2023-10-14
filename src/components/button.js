import React from "react";
import { Button } from "react-bootstrap";

function AddToCartButton({ itemId }) {
  const handleButtonClick = () => {
    window.open(`https://greet.bg/?add-to-cart=${itemId}.`);
  };

  return (
    <Button onClick={handleButtonClick} id="customButton4">
      Добавяне в количката
    </Button>
  );
}

export default AddToCartButton;
