import React from "react";
import styled from "styled-components";

const minCharacterRegex = /^[A-Za-z\d@$!%*#?&]{10,}$/;
const oneLowerCaseRegex = /.*[a-z]/;
const oneUppercaseRegex = /.*[A-Z]/;
const oneNumberRegex = /.*\d/;
const oneSpecialCharacterRegex = /.*\W/;

const PasswordChecks: React.FC<{ password: string }> = ({ password }) => {
  const isMinCharacterPassed = minCharacterRegex.test(password);
  const isOneLowerCasePassed = oneLowerCaseRegex.test(password);
  const isOneUpperCaseRegexPassed = oneUppercaseRegex.test(password);
  const isOneNumberRegex = oneNumberRegex.test(password);
  const isOneSpecialCharacterRegex = oneSpecialCharacterRegex.test(password);

  const minCharacterCondition = isMinCharacterPassed ? (
    <PassedCondition>Minimum 10 characters</PassedCondition>
  ) : (
    <Condition>Minimum 10 characters</Condition>
  );
  const oneLowerCaseCondition = isOneLowerCasePassed ? (
    <PassedCondition>At least one lower case character</PassedCondition>
  ) : (
    <Condition>At least one lower case character</Condition>
  );
  const oneUpperCaseCondition = isOneUpperCaseRegexPassed ? (
    <PassedCondition>At least one uppercase case character</PassedCondition>
  ) : (
    <Condition>At least one uppercase case character</Condition>
  );
  const oneNumberCondition = isOneNumberRegex ? (
    <PassedCondition>At least one number</PassedCondition>
  ) : (
    <Condition>At least one number</Condition>
  );
  const oneSpecialCharacterCondition = isOneSpecialCharacterRegex ? (
    <PassedCondition>At least one special character</PassedCondition>
  ) : (
    <Condition>At least one special character</Condition>
  );
  return (
    <div>
      {minCharacterCondition}
      {oneLowerCaseCondition}
      {oneUpperCaseCondition}
      {oneNumberCondition}
      {oneSpecialCharacterCondition}
    </div>
  );
};

const PassedCondition = styled.div`
  color: #00cc00;
  margin-bottom: 8px;
  font-size: 12px;
`;

const Condition = styled.div`
  color: black;
  margin-bottom: 8px;
  font-size: 12px;
`;

export default PasswordChecks;
