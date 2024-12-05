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
      ingredient = ingredient.replaceAll(" ", "_");
    }
    return ingredient;
  }

  getIngredient();

  let mainIngredient = getIngredient();
  console.log(mainIngredient);

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`)
  .then((res) => res.json())
  .then((result) => {
  favouriteMeals = result;
  let mealsArray = favouriteMeals.meals;
  let orderDescription = mealsArray[Math.floor(Math.random() * mealsArray.length)].strMeal;
  console.log(orderDescription);
  }
  ),
  (error) => {
  console.log(error);
  };

}
