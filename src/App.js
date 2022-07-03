import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";

function Payment() {
  const [success, setSuccess] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [orderID, setOrderID] = useState(false);

  const { id } = useParams();

  // creates a paypal order
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "BKS payment",
            amount: {
              currency_code: "EUR",
              value: id,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        setOrderID(orderID);
        return orderID;
      });
  };

  // check Approval
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      setSuccess(true);
    });
  };
  //capture likely error
  const onError = (data, actions) => {
    setErrorMessage("An Error occured with your payment ");
  };

  useEffect(() => {
    if (success) {
      alert("Payment successful!!");
    }
  }, [success]);
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AfLn-R4CGa94kI88nfSqiIGMGSVksgSec69HBzLBsoYGJoh4PnxeBVvKOb0uqaGb6S4HLGCx-DxBRAwe",
        currency: "EUR",
      }}
    >
      <div>
        <p>
          <span>${id}</span>
        </p>

        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </div>
    </PayPalScriptProvider>
  );
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<Payment />} />
      </Routes>
    </Router>
  );
}
