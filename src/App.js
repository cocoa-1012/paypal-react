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
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <PayPalScriptProvider
        options={{
          "client-id":
            "AffFVjpeVWCzGzYRB3hs1btcwdt1R0adzgVROBak5Fn0hClbBVFea-DznT-WXjcH1h1qjrkqKvPQ6ia-",
          currency: "EUR",
        }}
      >
        <div
          style={{
            width: "100%",
            margin: "auto",
            padding: "0px 20px",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </div>
      </PayPalScriptProvider>
    </div>
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
