import React from "react";
import "./MultiStepProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = ({ orderStatus, statusOrder }) => {
  // Get the current status index
  const currentStatusIndex = statusOrder.indexOf(orderStatus);

  // Calculate the percentage for the progress bar
  const stepPercentage = (currentStatusIndex + 1) * (100 / statusOrder.length);

  return (
    <div className="progress-bar-container mb-5 mt-5 ml-7 mr-3">
      <ProgressBar percent={stepPercentage}>
        {statusOrder.map((_, index) => (
          <Step key={index}>
            {({ accomplished }) => (
              <div className={`indexedStepContainer ${accomplished ? "accomplished" : ""}`}>
                <div className="indexedStep">{index + 1}</div>
                <div className={`statusTitle mt-2 ${accomplished ? "completed" : ""}`}>
                  {statusOrder[index]}
                </div>
              </div>
            )}
          </Step>
        ))}
      </ProgressBar>
    </div>
  );
};

export default MultiStepProgressBar;
