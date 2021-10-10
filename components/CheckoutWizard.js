import { Stepper, Step, StepLabel } from "@material-ui/core";
import React from "react";
import useStyles from "../utils/styles";

export default function CheckoutWizard({ activeStep = 0 }) {
    const classes = useStyles();
  return (
    <Stepper activeStep={activeStep} className={classes.transparentBackground} alternativeLabel>
      {["Login", "Shipping", "Payment Method", "Place Order"].map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
