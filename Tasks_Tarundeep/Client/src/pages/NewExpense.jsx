import axios from "axios";
import React, { useState } from "react";

const NewExpense = () => {
  const [expenseValue, setExpenseValue] = useState(0);
  const [expenseType, setExpenseType] = useState("food");

  const handleValueChange = (event) => {
    setExpenseValue(event.target.value);
  };

  const handleTypeChange = (event) => {
    setExpenseType(event.target.value);
  };

  const handleSubmit = async () => {
    let data = {
      type: expenseType,
      price: parseInt(expenseValue),
    };

    try {
      const response = await axios.post("/newExpense", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  return (
    <div className="flex flex-col gap-14 items-center h-screen pt-14">
      <h2 className="text-5xl">Add A New Expense</h2>
      <div>
        <label className="text-2xl">Value:</label>
        <input
          className="p-3 border"
          type="number"
          value={expenseValue}
          onChange={handleValueChange}
        />
        <label className="text-2xl">Type:</label>
        <select
          className="p-3 border"
          value={expenseType}
          onChange={handleTypeChange}
        >
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="power">Power</option>
          <option value="water">Water</option>
          <option value="insurance">Insurance</option>
          <option value="transportation">Transportation</option>
          <option value="misc">Misc</option>
        </select>
      </div>
      <button className="text-xl px-4 py-3 border" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default NewExpense;
