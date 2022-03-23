import { parseEther } from "ethers/lib/utils";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  callContractMethod,
  handleContractInteractionResponse,
} from "../../utils";
import "./styles.css";

const DepositETH = ({ spotoCoin }) => {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e) => {
    const limit = e.target.value.includes(".") ? 6 : 5;
    if (e.target.value.length < limit) {
      setAmount(e.target.value.replace(/[^\d.]/g, ""));
    }
  };

  const contribute = async () => {
    if (amount <= 0) {
      return toast.error("You can't donate zero!");
    }

    const { result, error } = await callContractMethod(() =>
      spotoCoin.contribute({ value: parseEther(amount) })
    );

    handleContractInteractionResponse(result, error, toast);
    setAmount("");
  };

  return (
    <div className="deposit-eth-container">
      <h3>Buy SpotoCoin</h3>
      <div className="contribute-container">
        <input
          className="contribute-amount"
          placeholder="Amount"
          type="text"
          value={amount}
          onChange={handleAmountChange}
        />{" "}
        <span className="eth">ETH</span>
      </div>
      {amount && (
        <>
          <div className="estimated-sc">
            Will get you: {amount * 5} <strong>SPT</strong>
          </div>
          <button className="cool-button" onClick={contribute}>
            Buy
          </button>
        </>
      )}
    </div>
  );
};

export default DepositETH;