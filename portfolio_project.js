let orders = [];
let favouriteMeals = [];
let chefsFavourites = [];

function pageLoad() {

  if (sessionStorage.getItem("orderNumber") === null || sessionStorage.getItem("orders") === null) {
    sessionStorage.setItem("orders", JSON.stringify(orders));
    sessionStorage.setItem("orderNumber", 1)
  } else {
    orders = JSON.parse(sessionStorage.getItem("orders"));

  }

  function Orders(description, orderNo, completed) {
    this.description = description;
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

    let mainIngredient = getIngredient();
    console.log(mainIngredient);

    function getMeals() {
      try {
        return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`)
        .then((res) => res.json())
        .then((result) => {
        favouriteMeals = result;
        mealsArray = favouriteMeals.meals;
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
          return Promise.reject(err)
        }
    }

    const createOrders = (fn) => {
      fn()
      .then((meals) => {
        if (meals !== null) {
          let order = new Orders();
          order.description = meals[Math.floor(Math.random() * meals.length)].strMeal;
          order.orderNo = orders.length + 1;
          order.completed = Boolean(prompt("Is this order completed? Type Y or leave it blank if not completed."))
          orders.push(order);
          let answer = prompt("Do you want to make another order? Type Y or N");
          if (answer === "Y") {
            mainIngredient = getIngredient();
            getMeals(mainIngredient);
            createOrders(getMeals);
          } else {
             sessionStorage.setItem("orders", JSON.stringify(orders));
             sessionStorage.setItem("orderNumber", orders.length + 1);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }

    const userOrders = createOrders(getMeals);

    const orderString = sessionStorage.getItem("orders");
    const orderObjects = JSON.parse(orderString);
    const uncompleted = orderObjects.filter((item) => item.completed === false);

    console.log(uncompleted);

  }




pageLoad();
