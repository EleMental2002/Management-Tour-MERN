import React from "react";
import "../styles/Adventure.css";

function Adventure() {
  return (
    <div className="adventure-container">
      <div className="adventure-header">
        <h1>Embark on a Sikkim Adventure!</h1>
        <p>
          Get ready to explore the enchanting landscapes and vibrant culture of
          Sikkim.
        </p>
      </div>
      <div className="adventure-content">
        <img src="" alt="Sikkim Adventure" className="adventure-image" />
        <div className="adventure-description">
          <h2>Discover the Jewel of the Himalayas</h2>
          <p>
            Immerse yourself in the breathtaking beauty of Sikkim's mountains,
            lush valleys, and serene monasteries. Experience the warm
            hospitality of its people and savor the flavors of local cuisine.
          </p>
          {/* <button className="adventure-button">
            Start Your Sikkim Journey
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Adventure;
