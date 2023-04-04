import styled, { createGlobalStyle } from "styled-components";

const Globalstyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body{
    background-color: #333;
    color: #fff;
  }
`;

export {
  Globalstyle
};