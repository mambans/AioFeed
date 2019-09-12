import Alert from "react-bootstrap/Alert";
import React, { useEffect, useState } from "react";

import Utilities from "./../../utilities/Utilities";

function ErrorHandeling(data) {
  const [errorMessage, setErrorMessage] = useState(data.data.message);
  const [errorTitle, setErrorTitle] = useState();

  useEffect(() => {
    async function handleErrorContent() {
      let error;

      switch (data.data.message) {
        case "Network Error":
          error = data.data.message + " -Database server may be offline.";
          break;
        default:
          error = data.data.message;
          break;
      }

      setErrorMessage(error);

      setErrorTitle(data.data.title ? data.data.title : "Oh-oh! Something bad happened.");
    }
    handleErrorContent();
  }, [data.data.message, data.data.title, errorMessage]);

  return (
    <Alert variant="warning" style={Utilities.alertWarning}>
      <Alert.Heading>{errorTitle}</Alert.Heading>
      <hr />
      {errorMessage.toString()}
    </Alert>
  );
}

// class ErrorHandeling extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hasError: false,
//       error: this.props.data,
//       info: null,
//       errorTitle: "Oh-oh! Something bad happened.",
//     };
//   }

//   ErrorHandelingText() {
//     let error;

//     switch (this.props.data.message) {
//       case "Network Error":
//         error = this.props.data.message + " -Database server may be offline.";
//         break;
//       default:
//         error = this.props.data.message;
//     }

//     this.setState({
//       error,
//       errorTitle: this.props.data.title ? this.props.data.title : "Oh-oh! Something bad happened.",
//     });
//   }

//   componentDidMount() {
//     console.log("fgh: ", this.props.data);

//     this.ErrorHandelingText();
//   }

//   render() {
//     const { error, errorTitle } = this.state;
//     return (
//       <Alert variant="warning" style={Utilities.alertWarning}>
//         <Alert.Heading>{errorTitle}</Alert.Heading>
//         <hr />
//         {error.toString()}
//       </Alert>
//     );
//   }
// }

export default ErrorHandeling;
