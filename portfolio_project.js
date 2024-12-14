// Declare arrays to store user's orders and data from API
let orders = [];
let favouriteMeals = [];

function pageLoad() {

// Check if session storage already populated
if (
  sessionStorage.getItem("orderNumber") === null ||
  sessionStorage.getItem("orders") === null
) {
  sessionStorage.setItem("orders", JSON.stringify(orders));
  sessionStorage.setItem("orderNumber", 1);
} else {
  orders = JSON.parse(sessionStorage.getItem("orders"));
}

// Constructor function for user's order objects
function Orders(description, orderNo, completed) {
  this.description = description;
  this.orderNo = orderNo;
  this.completed = completed;
}

// Function to create list of uncompleted orders in prompt
let str = ``;

function uncompletedList(array) {
  for (let i = 0; i < array.length; i++) {
    let newStr = `Description:  ${array[i].description}  |  Order Number:  ${array[i].orderNo}\n`;
    str = str + newStr;
  }
  return str;
}

// Function to create user ingredient for API call
function getIngredient() {
  let ingredient = prompt(
    "What is the main ingredient of your meal?"
  ).toLowerCase();
  if (ingredient.includes(" ")) {
    ingredient = ingredient.replaceAll(" ", "_");
  }
  return ingredient;
}

// Variable to call getIngredient function and retrieve API data
let mainIngredient = getIngredient();

// Function to get data from API
function getMeals() {
  try {
    return fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`
    )
      .then((res) => res.json())
      .then((result) => {
        favouriteMeals = result;
        mealsArray = favouriteMeals.meals;
        return mealsArray;
      });
  } catch (err) {
    console.log("Error fetching API", err);
  }
}

// Call getMeals function
getMeals();

/* Function to create order objects from API data, pass them to session storage and update completed status. I tried to split this into two functions, but owing to the asynchronous nature of the overall program, sessionStorage.getItems returns an empty array outside the function and I could find a successful solution for this. */

const createOrders = (fn) => {
  // Get asynchronous data
  fn()
    .then((meals) => {

      // Create order objects and push to orders array
      let order = new Orders();
      order.description =
        meals[Math.floor(Math.random() * meals.length)].strMeal;
      order.orderNo = orders.length + 1;
      order.completed = Boolean(
        prompt(
          "Is this order completed? Type Y or leave it blank if not completed."
        )
      );
      orders.push(order);

      // Code to repeat above process to create additional order objects
      let answer = prompt("Do you want to make another order? Type Y or N");
      if (answer === "Y") {
        mainIngredient = getIngredient();
        getMeals(mainIngredient);
        createOrders(getMeals);
      } else {
        // Pass orders to session storage when user has finished making orders
        // Save number of final order to session storage
        sessionStorage.setItem("orders", JSON.stringify(orders));
        sessionStorage.setItem("orderNumber", orders.length);

        // Get items from session storage
        const orderString = sessionStorage.getItem("orders");
        const orderObjects = JSON.parse(orderString);

        // Filter uncompleted orders
        const uncompleted = orderObjects.filter(
          (item) => item.completed === false
        );

        // Display uncompleted orders to user and ask if they want to complete them
        let userChoice = prompt(
          `Here is a list of uncompleted orders:\n\n${uncompletedList(
            uncompleted
          )}\n\nDo you wish to mark these as completed? Type 1 for yes and 0 for no.`
        );
        // Nested loop to enable users to enable user to update completed status if they so wish
        if (userChoice === "1") {
          for (let i = 0; i < uncompleted.length; i++) {
            for (let j = 0; j < orderObjects.length; j++) {
              if (orderObjects[j].orderNo === uncompleted[i].orderNo) {
                orderObjects[j].completed = !!Number(
                  prompt(
                    `Do you want to mark ${orderObjects[j].description}  ${orderObjects[j].orderNo} as completed? Type ${orderObjects[j].orderNo} for yes and 0 for no.`
                  )
                );
              }
              // Save updated order array and final order number to session storage
              sessionStorage.setItem("orders", JSON.stringify(orderObjects));
              sessionStorage.setItem("orderNumber", orderObjects.length);
            }
          }
        }
      }
    })
    // Catch block contains code deal with event of API returning {"meals":null}
    .catch((err) => {
      console.log(err);
      alert("Your ingredient is not available.");
      mainIngredient = getIngredient();
      getMeals();
      createOrders(getMeals);
    });
};

// Function call to createOrders
const userOrders = createOrders(getMeals);

}

pageLoad();
