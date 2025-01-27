import React from "react";
import "./MultiStepProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = ({ orderStatus, onPageNumberClick }) => {
  // Define the order statuses and their corresponding percentages
  const statusOrder = ['Confirmed', 'Dispatched', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Get the current status index
  const currentStatusIndex = statusOrder.indexOf(orderStatus);

  // Calculate the percentage for the progress bar
  const stepPercentage = (currentStatusIndex + 1) * (100 / statusOrder.length);

  return (
    <ProgressBar percent={stepPercentage}>
      {statusOrder.map((status, index) => (
        <Step key={index}>
          {({ accomplished, index: stepIndex }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : ""}`}
              onClick={() => onPageNumberClick(stepIndex + 1)}
            >
              {stepIndex + 1}
            </div>
          )}
        </Step>
      ))}
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
