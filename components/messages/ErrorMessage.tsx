import React from 'react';

export const ErrorMessage = (props:any) => {
  return <span style={{fontSize: "12px",color: "#d61744",float: "left"}}>{props.text}</span>;
};

export default ErrorMessage;