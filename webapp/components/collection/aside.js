import React from "react";

const aside = () => {
  return (
    <aside>
      <button class="dropdown-btn">
        Status
        <span className="material-icons">expand_more</span>
      </button>{" "}
      <button class="dropdown-btn">
        Price
        <span className="material-icons">expand_more</span>
      </button>{" "}
      <button class="dropdown-btn">
        Quantity
        <span className="material-icons">expand_more</span>
      </button>
      <button class="dropdown-btn">
        Dropdown
        <span className="material-icons">expand_more</span>
      </button>
      {/* <div class="dropdown-container">
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
      <a href="#contact">Search</a> */}
    </aside>
  );
};

export default aside;
