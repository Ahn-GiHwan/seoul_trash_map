import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const globalStyles = createGlobalStyle`
    ${reset};
    a{
        text-decoration: none;
        color: inherit;
    }
    a:hover{
        text-decoration: none;
    }
    *{
        box-sizing: boerder-box;
    }
    body{
      font-family: 'Hi Melody', cursive;
      user-select: none;
    }
`;

export default globalStyles;