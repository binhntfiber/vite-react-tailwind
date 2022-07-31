import React from "react";
import styled from "styled-components";

const Error = styled.div`
  color: #ff0000;
  margin-top: 8px;
`;

const ErrorMessage: React.FC<{ error?: string; fontSize?: string }> = ({
  error,
  fontSize = "14px",
}) => {
  return <Error style={{ fontSize: fontSize }}>{error}</Error>;
};

export default ErrorMessage;
