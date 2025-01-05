let server = 'https://platformshdeploy-zitavcq-6cxmlqongi3dc.au-2.platformsh.site/'
let OrderTableBody = document.getElementById('OrderTableBody')
const searchInput = document.getElementById('searchInput')


// Defining some createrInfo Seciton variable start here 
let createrID = document.getElementById("createrID");
let createrName = document.getElementById("createrName");
let createrLocation = document.getElementById("createrLocation");
let createrPhone = document.getElementById("createrPhone");
var readyToSave = false



// console.log(OrderTableBody);

TotalProductList =[];



// console.log(TotalProductList);

// Getting All the Prodduct functionality start here 
(() => {
  fetch(`${server}api/Order/getAllProducts`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // console.log('Received data from /api/Order/', data);
      TotalProductList = data;
      SuggestionListRender();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
})();

// Getting All the Prodduct functionality end here 
// Getting the Order by it's OrderId start here
     // Extract OrderId from the URL parameters

(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const OrderID = urlParams.get('OrderID');

  if (!OrderID) {
    return ""
  }else {
    document.getElementById('deleteModalButton').classList.remove('invisible')

    fetch(`${server}api/Order/GetOrderById/${OrderID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // console.log('Received data from /api/Order/', data);
      readyToSave = true;
      // Assuming the response data contains name, officeLocation, phone, and no
      document.getElementById('createrName').value = data.creater.name;
      document.getElementById('createrLocation').value = data.creater.officeLocation;
      document.getElementById('createrPhone').value = "0" + data.creater.phone;
      document.getElementById('createrID').value = data.creater.no;
      document.querySelector('.createrInfo').setAttribute('data-updated-at', data.order.updatedAt)
      // setttin previousPaymentTotal values 
      document.getElementById('previousPaymentTotal').innerText = "Rs : " + data.previousRemainingTotal;

      RenderOrder(data.order)

    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  
})();

function RenderOrder(order){
const { productList, billSection } = order

let tableHTML = ''; // Initialize an empty string to store the HTML for the table rows


productList.map((elem, i) => {
    const image = elem.imageUrl ? `${server}web/uploads/Images/ProductImg/` + elem.imageUrl : "https://via.placeholder.com/50";

    // Append HTML for each product to the tableHTML string
    tableHTML += `
        <tr data-productid="${elem.productId}">
            <td class="px-4 py-2">
                <img src="${image}" alt="Product Image" class="w-12 h-12 object-cover rounded">
            </td>
            <td class="px-4 py-2 min-h-[2rem]">${elem?.productName}</td>
            <td oninput="ProductRowTotal(this); calculateTotalAmount()" contenteditable="true" class="text-center px-4 py-2">${elem?.quantity}</td>
            <td oninput="ProductRowTotal(this); calculateTotalAmount()" contenteditable="true" class="text-center px-4 py-2">${elem?.price}</td>
            <td class="text-center px-4 py-2">${elem?.total}</td>
            <td class="px-4 py-2">
                <button onclick="removeProduct(this)" class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-300">Remove</button>
            </td>
        </tr>
    `;
});

// Set the innerHTML of OrderTableBody to the generated tableHTML
OrderTableBody.innerHTML = tableHTML;

document.getElementById('totalAmount').textContent = parseInt( billSection.totalAmount )
document.getElementById('UpfrontPayment').value = parseInt( billSection.upfrontPayment )
document.getElementById('remainingPayment').textContent = parseInt( billSection.remainingPayment )



}




// Getting the Order by it's OrderId End here



// SuggestionList Render Functin 
function SuggestionListRender(params) {
    let SuggestionList = document.getElementsByClassName('suggestionList')[0]

    TotalProductList.map((ele,i)=>{

      const image = ele.imageUrl ? "/Images/ProductImg/" + ele.imageUrl : "https://via.placeholder.com/50"

        SuggestionList.innerHTML += `
        <div onClick="AddToOrder('${ele._id}')" class="suggestionItem">
        <div class="mx-4 my-2 w-12 h-12 imgContainer">
          <img src="${image}" alt="Product Image" class="w-full h-full object-cover rounded">
        </div>
        <div class="px-2 py-2 max-w-md  text-md min-h-[2rem]">${ele.productName}</div>
      </div>
        `
    })

}
SuggestionListRender()

// SuggestionList Search functionality start here
	// Get the table rows

    
	// Add event listener for input changes
	searchInput.addEventListener('input', function() {

    let SuggestionItems = document.querySelectorAll('.suggestionItem')
	  const searchTerm = searchInput.value.trim().toLowerCase();
	  SuggestionItems.forEach(item => {
		const productName = item.querySelector('div:nth-child(2)').textContent.trim().toLowerCase();
		if (productName.includes(searchTerm)) {
		  item.style.display = '';
		} else {
		  item.style.display = 'none';
		}
	  });
	});


// SuggestionList Search functionality Ends here




// SuggestionListToggle here 

// Get references to the input and suggestion list elements
const suggestionList = document.querySelector('.suggestionList');



document.addEventListener('click', function(event) {
    const searchBarParent = document.querySelector('.searchBarParent');
    const suggestionList = document.querySelector('.suggestionList');
    const searchInput = document.getElementById('searchInput');

    // Check if the clicked element is not the search input or within the searchBarParent or suggestionList
    if (!searchInput.contains(event.target) && !searchBarParent.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.style.display = 'none';
    }
});

// Add event listener for click on search input
searchInput.addEventListener('click', function() {
    // Toggle visibility of suggestion list
    suggestionList.style.display = suggestionList.style.display === 'none' ? 'block' : 'none';
});





// Add To Order Functionality start here
function AddToOrder(par) {
  TotalProductList.forEach((elem, i) => {
      if (elem._id === par) {
          // Check if the product already exists in the table
          if (!isProductInOrder(elem.productName)) {
              const image = elem.imageUrl ? "/Images/ProductImg/" + elem.imageUrl : "https://via.placeholder.com/50";

              OrderTableBody.innerHTML += `
              <tr data-productid="${elem._id}">
              <td class="px-4 py-2">
                <img src="${image}" alt="Product Image" class="w-12 h-12 object-cover rounded">
              </td>
              <td class="px-4 py-2 min-h-[2rem]">${elem.productName}</td>
              <td oninput="ProductRowTotal(this); calculateTotalAmount()" contenteditable="true" class="text-center px-4 py-2">1</td>
              <td oninput="ProductRowTotal(this); calculateTotalAmount()" contenteditable="true" class="text-center px-4 py-2">${CreaterId=== "1" ? elem.price : 0 }</td>
              <td class="text-center px-4 py-2">${CreaterId=== "1" ? elem.price : 0 }</td>
              <td class="px-4 py-2">
                <button onclick="removeProduct(this)" class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-300">Remove</button>
              </td>
              </tr>
              `;
          }
      }
  });

  // Hide suggestion list after adding the product
  const suggestionList = document.querySelector('.suggestionList');
  suggestionList.style.display = 'none';

  // Callculating and updateing total 
  calculateTotalAmount()
}

// Function to check if the product already exists in the table
function isProductInOrder(productName) {
  const rows = OrderTableBody.querySelectorAll('tr');
  for (const row of rows) {
      // Check if the product name exists in any of the rows
      if (row.querySelector('td:nth-child(2)').textContent.trim() === productName) {
          return true; // Product already exists
      }
  }
  return false; // Product does not exist
}


// Add To Order Functionality End here
// Extract Values Funcionality start here 
function extractValuesFromTable() {
  const tableRows = document.querySelectorAll('tr[data-productId]'); // Select all <tr> elements with data-productId attribute
  const productList = [];
console.log(tableRows);
  tableRows.forEach(row => {

    var imageName = ""; // Declare the variable outside the scope

    // Get the <img> element
    const src = row.querySelector('img').getAttribute('src');
    if (src !== "https://via.placeholder.com/50") {
        const parts = src.split('/');
        // Split the src value by '/' to extract the image name
        imageName = parts[parts.length - 1];
    }
    


      const productId = row.dataset.productid ? row.dataset.productid : ""; // Extract product ID from data-productId attribute
      const productName = row.querySelector('td:nth-child(2)').textContent.trim(); // Extract product name from the second <td> element
      const quantity = parseInt(row.querySelector('td:nth-child(3)').textContent.trim()); // Extract quantity from the third <td> element
      const price = parseInt(row.querySelector('td:nth-child(4)').textContent.trim()); // Extract price from the fourth <td> element
      const total = parseInt(row.querySelector('td:nth-child(5)').textContent.trim()); // Extract total from the fifth <td> element

      // Construct an object with extracted values and push it to the array
      productList.push({
          imageUrl : imageName,
          productId: productId,
          productName: productName,
          quantity: quantity,
          price: price,
          total: total
      });
  });

  const totalAmount = parseInt(document.getElementById('totalAmount').textContent.trim());
  const upfrontPayment = parseInt(document.getElementById('UpfrontPayment').value.trim());
  const remainingPayment = parseInt(document.getElementById('remainingPayment').textContent.trim());

  const billSection = {
      totalAmount: totalAmount,
      upfrontPayment: upfrontPayment,
      remainingPayment: remainingPayment
  };

  const extractedValues = {
    productList,
    billSection
  }

  return extractedValues;
}


// Extract Values Funcionality End here 



// Add now Function 
document.getElementById('AddNow').addEventListener('click',function name(params) {
    if(searchInput.value !== ''){
        console.log(searchInput.value.trim());
        OrderTableBody.innerHTML += `
        <tr data-productid="">
        <td class="px-4 py-2">
          <img src="./Images/ProjectImgs/50_placeholder.png" alt="Product Image" class="w-12 h-12 object-cover rounded">
        </td>
        <td class="px-4 py-2 min-h-[2rem]">${searchInput.value.trim()}</td>
        <td oninput="ProductRowTotal(this); calculateTotalAmount()" contenteditable="true" class="text-center px-4 py-2">0</td>
        <td oninput="ProductRowTotal(this); calculateTotalAmount()" contenteditable="true" class="text-center px-4 py-2">0</td>
        <td  class="text-center px-4 py-2">0</td>
        <td class="px-4 py-2">
          <button onclick="removeProduct(this)" class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-300">Remove</button>
        </td>
      </tr>
        `
    }
})


// ProductRowTotal this function total the single row
function ProductRowTotal(event) {
    // Regular expression to match exactly two digits
    const twoDigitRegex = /^\d{2}$/;
    if (twoDigitRegex.test(event.innerText)) {
      const parsedvalue = parseInt(event.innerText)
      event.innerText = parsedvalue

        // Move the cursor to the end of the text node
        const range = document.createRange();
        const selection = window.getSelection();
        const textNode = event.childNodes[0];
        range.setStart(textNode, textNode.length);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

    }
    const Quantity = parseFloat(event.parentNode.children[2].innerHTML)
    const Price = parseInt(event.parentNode.children[3].innerHTML)
    let Total = event.parentNode.children[4]
    let CalcTotal = Quantity * Price
    
        // Check if the numericValue is NaN
        if (isNaN(CalcTotal)) {
            CalcTotal = 0; // Set it to 0 if it's NaN
        }


        Total.innerHTML = CalcTotal
}

// Product remove function 
function removeProduct(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    calculateTotalAmount();
}

// Calculate total Amount 
function calculateTotalAmount() {
  const tableBody = document.getElementById('OrderTableBody');
  let totalAmount = 0;

  // Loop through each table row (<tr>)
  for (const row of tableBody.querySelectorAll('tr')) {
    // Get the element containing the total price (4th index)
    const totalPriceElement = row.querySelector('td:nth-child(5)');

    // Check if the element exists and has a valid number
    if (totalPriceElement && !isNaN(parseFloat(totalPriceElement.textContent))) {
      const totalPrice = parseFloat(totalPriceElement.textContent);
      totalAmount += totalPrice; // Add the price to the total
    }
  }

  // Update the total amount element (assuming it has the ID "totalAmount")
  document.getElementById('totalAmount').textContent = totalAmount;

  // Updateing the remainingPayment
  updateRemainingPayment()
}




function updateRemainingPayment() {
  const totalAmount = parseFloat(document.getElementById('totalAmount').textContent);
  const upfrontPaymentInput = document.getElementById('UpfrontPayment');

  const remainingPaymentSpan = document.getElementById('remainingPayment');

  const urlParams = new URLSearchParams(window.location.search);
  const CreaterId = urlParams.get('CreaterId');
  
  if (CreaterId  === "1") {
    upfrontPaymentInput.value = totalAmount
  }
  
  let upfrontPayment = parseFloat(upfrontPaymentInput.value);


  // Input validation (optional)
  if (isNaN(upfrontPayment) || upfrontPayment < 0) {
    upfrontPaymentInput.value = 0; // Set to 0 if invalid input
    upfrontPayment = 0;
  }

  const remainingPayment = Math.round(totalAmount - upfrontPayment);
  remainingPaymentSpan.textContent = remainingPayment;
}


// updateRemainingPayment functionality End here


// Moadles Toggle and Work functionality Start here

// Function to toggle modal visibility
function toggleDeleteModal() {
	const modal = document.getElementById('deleteModal');
    modal.classList.toggle('hidden');
}

function handleDelete() {
  console.log('handleDelete');
  // rest of the function explains here 
  const urlParams = new URLSearchParams(window.location.search);
  const OrderID = urlParams.get('OrderID');

  if (!OrderID) {
    return ""
  }else {

    fetch(`${server}api/Order/DeleteOrder/${OrderID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      window.location.href= './Order.html'
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

  }



  
	toggleDeleteModal()
}

// Toggle save modal visibility
function toggleSaveModal() {
    const modal = document.getElementById('saveModal');
    modal.classList.toggle('hidden');
}




// Handle save action

// Handle save action
function handleSave() {
  // Your save action logic here
  let readyToSave = checkValue()

  

  
  
  if (readyToSave) {
    
    const extractedValues = extractValuesFromTable()
    console.log(extractedValues);
    console.log(extractedValues.billSection.totalAmount != 0);


if (extractedValues.productList.length >= 1 && extractedValues.billSection.totalAmount != 0) {
     // Extract CreaterId from the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const CreaterId =  parseInt(createrID.value)
      const OrderID = urlParams.get('OrderID');
      // If LedgerId is present that mean we are Modifying the Ledger
  if (OrderID) {
console.log('modify Call here ');
    ModifyedSaver(extractedValues)

  }if (!OrderID && CreaterId) {
    console.log("only new Order exsisted user");
    const data = {
      CreaterNo: parseInt(createrID.value),
      productList: extractedValues.productList ,
      billSection : extractedValues.billSection
    }
    

    fetch(`${server}api/Order/CreateOrderByCreaterNo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // You can include a request body if needed
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to Create Order by number');
      }
      return response.json();
    }).then(data => {
      console.log(data);
      const OrderID = data.newOrder._id
      window.location.href= `/Order.html?OrderID=${OrderID}&CreaterId=${CreaterId}`;
    })
    .catch(error => {
      console.error('Error Making Order By CreaterNo:', error);
      throw error; // Re-throw the error for the caller to handle
    });


  }if (!OrderID && !CreaterId) {
    console.log("this is new Order new creater");
    const data = {
      creater:{
        name: createrName.value,
        officeLocation : createrLocation.value,
        phone : parseInt( createrPhone.value ),
      },
      order:extractedValues
    }
    

    fetch(`${server}api/Order/CreateOrderAndCreater`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // You can include a request body if needed
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data from Ledger table');
      }
      return response.json();
    }).then(data => {
      console.log(data);
      const OrderID = data.newOrder._id;
      window.location.replace(`/Order.html?OrderID=${OrderID}`)
    })
    .catch(error => {
      console.error('Error fetching data from Ledger table:', error);
      throw error; // Re-throw the error for the caller to handle
    });


  }


}

}


toggleSaveModal()
}




// Moadles Toggle and Work functionality End here



// Function to add background color to the button
function InputChecker() {
  // Get the values of the input elements
  const nameValue = createrName.value.trim();
  const locationValue = createrLocation.value.trim();
  var phoneValue =  createrPhone.value.trim();
  // var phoneValue =  parseFloat( createrPhone.value.trim() )
  // Regular expression to match 11-digit numbers starting with "03"
  const phoneRegex = /^03\d{9}$/;



  // Check if any of the input values are empty
  if (nameValue !== '' && locationValue !== '' && phoneValue !== '') {
      // Set readyToSave to false if any input is empty
      if (phoneRegex.test(phoneValue)) {
        // Setting Ready to Save Value Accordingly
        readyToSave = true;
        createrPhone.classList.remove("text-red-600");
    } else {
        // Setting Ready to Save Value Accordingly
        readyToSave = false;
        createrPhone.classList.add("text-red-600");
    }


  }
}


// Add event listeners to input elements
createrName.addEventListener("input", InputChecker);
createrLocation.addEventListener("input", InputChecker);
createrPhone.addEventListener("input", InputChecker);





function checkValue() {
  var CreaterInfoSection = document.getElementById("createrID").parentElement.parentElement.parentElement

  // Check if the value is wrong (e.g., empty)
  if (!readyToSave) {
    document.documentElement.scrollTop = 0;

    CreaterInfoSection.classList.add("wobble"); // Apply wobble animation
    setTimeout(function() {
      CreaterInfoSection.classList.remove("wobble"); // Remove animation after 0.5s
    }, 500);
    // You can add additional logic here to handle wrong values
    console.log("Please enter a valid value.");
    return readyToSave;
  } else {
    // Handle correct value
    console.log("Value is correct ");
    return readyToSave;
  }
}

// Functionailty to check creater is valid End here 

// UpDate CreaterInfo by Phone numbr start here 
function searchCreaterByPhone() {

  var phoneValue =  createrPhone.value.trim();
  // Define the regex for phone number validation
  const phoneRegex = /^03\d{9}$/;

  // Validate the phone number format
  if (!phoneRegex.test(phoneValue)) {
     console.log('Invalid phone number format');
     return;
  }
 
  // Parse the phone number as a float (though typically not necessary for phone numbers)
  const parsedPhoneValue = parseFloat(phoneValue);
 
  // Prepare the data to be sent in the request body
  const requestBody = {
    CreaterPhone: parsedPhoneValue
  };

  // Make a POST request using the Fetch API
  fetch('api/Ledger/CreaterSearchByPhone', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(requestBody),
  })
  .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
     // Assuming the response data contains createrName, createrLocation, and createrPhone
      const { name, officeLocation, phone ,no } = data.creater

      createrName.value = name;
      createrLocation.value = officeLocation;
      createrID.value = no;

      // setttin previousPaymentTotal values 
      document.getElementById('previousPaymentTotal').innerText = "Rs : " + data.previousRemainingTotal;

      readyToSave = true
  })
  .catch(error => {
      console.log('Phoe NO Not Found:', error);
  });
}

createrPhone.addEventListener('input', searchCreaterByPhone)
// UpDate CreaterInfo by Phone numbr End here 


// Settting value in CreaterInfo Section by Getting CreaterId from url params start here 
window.onload = function() {
  // Extract CreaterId from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const CreaterId = urlParams.get('CreaterId');

  if (!CreaterId) {
    return;
  }

  // Construct the API URL
  const apiUrl = `${server}api/Order/GetCreaterById/${CreaterId}`;

  // Use Fetch API to make the GET request
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // console.log(data);
       // Assuming the response data contains name, officeLocation, phone, and no
        document.getElementById('createrName').value = data.creater.name;
        document.getElementById('createrLocation').value = data.creater.officeLocation;
        document.getElementById('createrPhone').value = "0" + data.creater.phone;
        document.getElementById('createrID').value = data.creater.no;
    // setttin previousPaymentTotal values 
        document.getElementById('previousPaymentTotal').innerText = "Rs : " + data.previousRemainingTotal;
        readyToSave = true;
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
};


// Settting value in CreaterInfo Section by Getting CreaterId from url params End here 

// Modify Save functionAlity start here 
function ModifyedSaver(data){


     // Extract CreaterId from the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const CreaterId =  parseInt(createrID.value)
      const OrderID = urlParams.get('OrderID');
      // Using dataset
      const updatedAt = document.querySelector('.createrInfo').dataset.updatedAt;
      console.log(updatedAt);

fetch(`${server}api/Order/UpdateOrder/${OrderID}`, {
method: 'PUT',
headers: {
  'Content-Type': 'application/json',
  'Updated-At': updatedAt // Add the updatedAt value to the headers
},
// You can include a request body if needed
body: JSON.stringify(data)
})
.then(response => {
  if (!response.ok) {
    if (response.status === 409) {
      window.location.reload(); // Reload the page if the response code is 409
      return; // Prevent further executionf
    }
    throw new Error('Failed to fetch data from Order Backend');
  }
  return response.json();
})
.then(data => {
  console.log(data);
  window.location.reload(); // Reload the page after successful operation
})
.catch(error => {
  console.error('Error updating data from Order Backend:', error);
  throw error; // Re-throw the error for the caller to handle
});
}

// Modify Save functionAlity End here 

// refresh the page with the current id functionality Start here
const RefreshSvg = document.getElementById("RefreshSvg");
const urlParams = new URLSearchParams(window.location.search);
const CreaterId = urlParams.get('CreaterId');
const OrderID = urlParams.get('OrderID');

if (OrderID) {
  const ButtonContainerParent = document.querySelector('.buttonContainer').parentElement
  ButtonContainerParent.classList.remove('hidden')

  const Atags = ButtonContainerParent.querySelectorAll('a')

  Atags[0].href= Atags[0].href + OrderID 
  Atags[1].href= Atags[1].href + OrderID 

}



if (CreaterId  === "1") {
  RefreshSvg.classList.remove('hidden')
}

RefreshSvg.addEventListener('click',()=>{
  RefreshSvg.classList.add('rotate')
  RefreshSvg.style.color = 'black'
        setTimeout(() => {
          location.href = `./Order.html?CreaterId=${parseInt(createrID.value)}`

        }, 500)
      })

// refresh the page with the current id functionality End here

