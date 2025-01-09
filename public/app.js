const getPressed = async (price) => {
  const convertedResult = parseInt(price);
  if (price.trim().length === 0) {
    alert("ERROR: Price cannot be empty");
    window.location.href = "/"; // Change this to the desired home page URL

  }
    else if(isNaN(convertedResult) === true) 
    { 
      alert("ERROR: Price must be a number");
      window.location.href = "/"; // Change this to the desired home page URL

    }
    else{
    try {
      const result = await fetch(`http://localhost:8080/api/it/price?price=${price}`);
      console.log(result);
    
      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.message);
      }
    
      const resultAsJSON = await result.json();
      console.log(resultAsJSON);
    
      let output = "";
      for (let currIt of resultAsJSON) {
        output += `
          <p>Product Name: ${currIt.title}</p>
          <p>Product Description: ${currIt.description}</p>
          <p>Price: ${currIt.price}</p>
          <img src="${currIt.thumbnail}"/>
          <hr/>
        `;
      }
      document.querySelector("#results").innerHTML = output;
    } catch (err) {
      // Handle the error here
      
      alert("No products found for the given price.");
      console.error(err);
    
      // Assuming you want to redirect to the home page on error
      window.location.href = "/"; // Change this to the desired home page URL
    }
  }
};

function submitLoginForm(e) {
  e.preventDefault();
  const price = e.target["price"].value;
  document
    .querySelector("#getProd")
    .addEventListener("click", getPressed(price));
}

// if (!result) {
//       alert("ERROR: Price must be a number");
//       window.location.href = "/";
//       res
//         .status(404)
//         .json({ message: "No products found for the given price." });
