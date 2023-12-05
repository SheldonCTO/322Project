

const getPressed = async () => {
  try {
    const result = await fetch("http://localhost:8080/api/it/price");
    const resultAsJSON = await result.json();

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
  } catch (err) {}
};
document.querySelector("#getProd").addEventListener("click", getPressed);