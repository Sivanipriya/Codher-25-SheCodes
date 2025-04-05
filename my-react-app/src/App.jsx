import React, { useState } from "react";
import axios from "axios";
import "./App.css";


const App = () => {
  const [formData, setFormData] = useState({
    username: "",
    "Body Type": "",
    Sex: "",
    Diet: "",
    "How Often Shower": "",
    "Heating Energy Source": "",
    Transport: "",
    "Vehicle Type": "",
    "Social Activity": "",
    "Monthly Grocery Bill": "",
    "Frequency of Traveling by Air": "",
    "Vehicle Monthly Distance Km": "",
    "Waste Bag Size": "",
    "Waste Bag Weekly Count": "",
    "How Long TV PC Daily Hour": "",
    "How Many New Clothes Monthly": "",
    "How Long Internet Daily Hour": "",
    "Energy efficiency": "",
    Recycling: "",
    Cooking_With: "",
  });

  const [result, setResult] = useState(null);
  const [reductionUsername, setReductionUsername] = useState("");
  const [reducingAttributes, setReducingAttributes] = useState([]);
  const [reducedAmount, setReducedAmount] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setReducingAttributes([]);
    setReducedAmount(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        username: formData.username,
        user_data: formData,
      });

      setResult(response.data);

      const analysisResponse = await axios.get(
        `http://127.0.0.1:5000/analyze_reduction/${formData.username}`
      );

      setReducingAttributes(analysisResponse.data.reducing_attributes);
      setReducedAmount(analysisResponse.data.reduced_amount);
    } catch (error) {
      console.error("Error during prediction or analysis:", error);
    }
  };

  const handleReductionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/analyze_reduction/${reductionUsername}`
      );
      setReducingAttributes(response.data.reducing_attributes);
      setReducedAmount(response.data.reduced_amount);
    } catch (error) {
      console.error("Error fetching reduction analysis:", error);
    }
  };

  const selectOptions = {
    "Body Type": ["Underweight", "Normal", "Overweight", "Obese"],
    Sex: ["Male", "Female"],
    Diet: ["Vegan", "Vegetarian", "Non-Vegetarian"],
    "How Often Shower": ["Daily", "Weekly", "Occasionally"],
    "Heating Energy Source": ["Electric", "Gas", "Wood"],
    Transport: ["Public", "Private", "Bicycle", "Walking"],
    "Vehicle Type": ["Petrol", "Diesel", "Electric", "Hybrid"],
    "Social Activity": ["Rarely", "Often", "Very Often"],
    "Frequency of Traveling by Air": ["Never", "Occasionally", "Frequently"],
    "Waste Bag Size": ["Small", "Medium", "Large"],
    "Energy efficiency": ["Yes", "No"],
    Recycling: ["Paper", "Plastic", "Both", "None"],
    Cooking_With: ["Oven", "Stove", "Microwave"],
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-green-300 bg-cover bg-center p-10"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2019/11/18/23/26/co2-4634069_960_720.jpg')",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          🌱 Carbon Footprint Detector
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          <div>
            <label className="block font-semibold">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            />
          </div>

          {Object.keys(formData).map(
            (key) =>
              key !== "username" && (
                <div key={key}>
                  <label className="block font-semibold">{key}:</label>
                  {selectOptions[key] ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="border p-2 w-full rounded-md"
                      required
                    >
                      <option value="">Select {key}</option>
                      {selectOptions[key].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="border p-2 w-full rounded-md"
                      required
                    />
                  )}
                </div>
              )
          )}
          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-200"
          >
            🌍 Predict Carbon Footprint
          </button>
        </form>

        {result && (
          <div className="p-6 rounded-md bg-green-50 border border-green-300 mb-10">
            <h3 className="text-xl font-bold text-green-700 mb-2">
              Predicted Carbon Footprint:
            </h3>
            <p className="text-lg text-green-900 mb-4">
              {result.predicted_footprint}
            </p>
          </div>
        )}


        <div className="mt-10">
          
          

          {(reducingAttributes.length > 0 || reducedAmount !== null) && (
            <div className="mt-5 p-5 bg-green-100 border rounded-md shadow-md">
              <h3 className="text-lg font-bold text-green-800 mb-2">
                Carbon Footprint Reduction Summary:
              </h3>
              {reducedAmount !== null && (
                <p className="mb-2">
                  <strong>Total Reduction:</strong>{" "}
                  <span className="text-green-700">{reducedAmount}</span> units
                </p>
              )}
              {reducingAttributes.length > 0 && (
                <>
                  <strong>Top Contributing Factors:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {reducingAttributes.map((attr, index) => {
                      const key = Object.keys(attr)[0];
                      const value = attr[key];
                      return (
                        <li key={index}>
                          {key}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;