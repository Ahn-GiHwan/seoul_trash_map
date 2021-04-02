import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const globalStyles = createGlobalStyle`
    ${reset};

    input[type="radio"]{
        visibility:hidden;
    }

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
      /* font-family: 'Gamja Flower', cursive; */
      font-family: 'Poor Story', cursive;
      user-select: none;
    }
`;

export default globalStyles;