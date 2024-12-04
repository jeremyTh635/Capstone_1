let orders = [];
let favouriteMeals = [];
let chefsFavourites = [];

function pageLoad() {

  if (sessionStorage.getItem("hasCodeRunBefore") === null) {
    sessionStorage.setItem("hasCodeRunBefore", true);
  } else {
    orders = JSON.parse(sessionStorage.getItem("orders"));
  }

  function Orders(orderList, orderNo, completed) {
    this.orderList = orderList;
    this.orderNo = orderNo;
    this.completed = completed;
  }

  function getIngredient() {
    let ingredient = prompt("What is the main ingredient of your meal?").toLowerCase();
  if (ingredient.includes(" ")) {
      ingredient = mainIngredient.replaceAll(" ", "_");
    }
    return ingredient;
  }

  let mainIngredient = getIngredient();
  console.log(mainIngredient);

  function getMeals() {
    try {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`)
      .then((res) => res.json())
      .then((result) => {
      favouriteMeals = result;
      mealsArray = favouriteMeals.meals;
      console.log(mealsArray);
      if (mealsArray === null) {
        alert("Your ingredient is not available.");
        mainIngredient = getIngredient();
        getMeals(mainIngredient);
      }
      return mealsArray;
      })
      }
      catch (err) {
        console.log("Error fetching API", err);
      }
  }

  console.log(getMeals());
  // Returns 'undefined'. Using other methods returns Promise { <pending> }

  }

/* The getMeals function now seems to be doing what it's supposed to do. The problem I'm now having is using the data outside the function other than logging it to the console. */


pageLoad();
