import React from "react";

const Spinner: React.FC = () => {
  return (
    <div>
      <img className="animate-spin" src="/images/spin.png" width="200px" height="200px" alt="" />
    </div>
  );
};

export default Spinner;
