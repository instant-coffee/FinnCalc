import Header from "../components/Header";
import Calculator from "../components/Calculator";

const FinnCalc = () => (

  <div className="input-group"> 
      {/* TODO:: Input component  */}

    <Header/>

    <Calculator />

    <style jsx>{`
      #__next {
        background-color: #23B197;
        padding: 3rem;
      }
      .input-group {
        width: 60%;
        font-family: Helvetica, sans-serif;
        color: #4969E1;
        background-color: #cfcfcf;
        padding: 10px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 0.5rem;
      }
    `}
    </style>
    <style global>{`
      #__next {
        background-color: #23B197;
        padding: 3rem;
      }
    `}  
    </style>
  </div>
)


export default FinnCalc