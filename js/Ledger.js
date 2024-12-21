
// var ledgerData = [
//   {
//     "Date": "2024-03-19",
//     "Description": "ups 8kv 7.5 pv capacity Hybrid Inverter 8.5 (KW) 5g pv10000",
//     "Note": "Naveed lahore hafiz center center plaza main building",
//     "Received": "2000",
//     "Remaining": "6000"
//   },
//   {
//     "Date": "",
//     "Description": "",
//     "Note": {
//       "ImageName": "z5.png"
//     },
//     "Received": "-10",
//     "Remaining": "6010"
//   },
//   {
//     "Date": "",
//     "Description": "",
//     "Note": {
//       "OrderID": "5"
//     },
//     "Credit": "-5000",
//     "Debit": "5000",
//     "Remaining": "11010"
//   }
// ]

var ledgerData = [];



var tbodyelem = document.getElementById('khataBody')

// Defining some createrInfo Seciton variable start here 
    let createrID = document.getElementById("createrID");
    let createrName = document.getElementById("createrName");
    let createrLocation = document.getElementById("createrLocation");
    let createrPhone = document.getElementById("createrPhone");
    var readyToSave = false;
// Select the element by its ID
    var PromisedPaymentDate = document.getElementById('PromisedPaymentDate');
    var createrData = ""



// Defining some createrInfo Seciton variable End here 
// Settting value in CreaterInfo Section by Getting CreaterId from url params start here 
window.onload = function() {
  // Extract CreaterId from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const CreaterId = urlParams.get('CreaterId');
  const LedgerId = urlParams.get('LedgerId');


  if (!LedgerId) {
    render(ledgerData)
    document.getElementById("DeleteLedgerButton").classList.add('invisible')
    document.getElementById("AttachmentImage").parentElement.classList.add('invisible')
    
  }


  if (LedgerId) {
    
     // Construct the API URL
  const apiUrl = `https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/GetLedger/${LedgerId}`;

  // Use Fetch API to make the GET request
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
       // Assuming the response data contains name, officeLocation, phone, and no
        document.getElementById('createrName').value = data.creater.name;
        document.getElementById('createrLocation').value = data.creater.officeLocation;
        document.getElementById('createrPhone').value = "0" + data.creater.phone;
        document.getElementById('createrID').value = data.creater.no;
        document.querySelector('.createrInfo').setAttribute('data-updated-at', data.ledgerWithId.updatedAt)
    // setttin previousPaymentTotal values 
        document.getElementById('previousPaymentTotal').innerText = "Rs : " + numberWithCommas(data.previousRemainingTotal);
        readyToSave = true;
        // Assigining the data form backend to ledgerData and rendering it 
        ledgerData = data.ledgerWithId.List
        render(ledgerData)
        calculateAndSetDifference()
        PromisedPaymentDate.value = data.ledgerWithId?.PromisedPaymentDate?.split('T')[0]

    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });


  }


  if (CreaterId) {
    
  // Construct the API URL
  const apiUrl = `https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/GetCreaterById/${CreaterId}`;
 
  // Use Fetch API to make the GET request
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
       // Assuming the response data contains name, officeLocation, phone, and no
        document.getElementById('createrName').value = data.creater.name;
        document.getElementById('createrLocation').value = data.creater.officeLocation;
        document.getElementById('createrPhone').value = "0" + data.creater.phone;
        document.getElementById('createrID').value = data.creater.no;
    // setttin previousPaymentTotal values 
        document.getElementById('previousPaymentTotal').innerText = "Rs : " + numberWithCommas(data.previousRemainingTotal);
        readyToSave = true;
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
  }


};


// Settting value in CreaterInfo Section by Getting CreaterId from url params End here 



// render function start here 

    function render(dataArray) {

var TotalRow = ''
for (let i = 0; i < dataArray.length + 10; i++)  {

var item = dataArray[i]

var NoteValue = '<td class="note px-4 py-3  border editable" contenteditable="true"></td>'

	if(item?.Note){

		if(item?.Note?.ImageName){
			var ImageName = item.Note.ImageName
			NoteValue = `<td class="note px-4 py-3  border editable" >
				<a target="_blank" class="bg-pink-300 hover:bg-pink-600 text-white px-2 py-1 rounded-md transition duration-300" href="https://ledgerbook3-n17dzrms.b4a.run/Images/AttachImages/${ImageName}">Open Image</a>
				<button class="bg-red-300 hover:bg-red-600 text-white px-2 py-1 rounded-md transition duration-300" onclick="removeImage(event,'${ImageName}')" >Delete</button>
				</td>`

		}
		if(item?.Note?.OrderID){
			var OrderID = item.Note.OrderID
			NoteValue = `<td class="note px-4 py-3  border editable" > 
				<a target="_blank" class="bg-indigo-300 hover:bg-indigo-600 text-white px-2 py-1 rounded-md transition duration-300" href="./Order.html?OrderID=${OrderID}">Open Order</a>
				</td>`
				
		}
		if(typeof item.Note == "string"){
			NoteValue = `<td class="note px-4 py-3  border editable" contenteditable="true">${item.Note}</td>`
			
		}
}

// Format as YYYY-MM-DD 
let Date = item?.Date ? item.Date.split("T")[0] : ""

var tr = `					
	<tr class="text-gray-700">
		<td class="px-2 py-3 border editable date" >
      <input value="${Date}" type="date" id="LedgerListDate"  class="px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500">
		</td>

		<td class="description px-4 py-3 text-ms editable text-green-700 font-semibold border bg-gray-50 " contenteditable="true">
			${item?.Description ?? ""}
		</td>
		${NoteValue}
		<td class="px-4 py-3 w-40 text-sm border editable" oninput="calculateAndSetDifference()" contenteditable="true" onkeypress="CalculateOnEnter(event)">
			${item?.Credit ?? ""}
		</td>
		<td class="px-4 py-3 w-40 text-sm border editable" oninput="calculateAndSetDifference()" contenteditable="true" onkeypress="CalculateOnEnter(event)">
			${item?.Debit ?? ""}
		</td>
		<td class="px-4 py-3 text-lg border text-black bg-gray-50 editable" oninput="calculateAndSetDifference()" contenteditable="true" onkeypress="CalculateOnEnter(event)">
			${item?.Remaining ?? ""}
		</td>
	</tr>
`

    TotalRow += tr
};

tbodyelem.innerHTML = TotalRow
}

// render function End here 
// Credit Debit CalculaterOnEnter functionality Start here 

function CalculateOnEnter(event) {
  // Check if Enter key is pressed (key code 13)
  if (event.key === 'Enter') {
      // Prevent default form submission behavior
      event.preventDefault();

      // Get the current value of the input field
      let inputField =event.target;

      // Evaluate the input value using eval method
      try {
          const result = eval(inputField.innerText);
          
          // Update the input field with the evaluated result
          inputField.innerText = result;

          calculateAndSetDifference()
      } catch (error) {
          // Handle any errors that occur during evaluation
          console.error('Error evaluating expression:', error);
      }
  }
}

// Credit Debit Calculater functionality End here 



// Calculate the Diffrence functionality start here 

function calculateAndSetDifference() {
  // Get all the rows in the table body
  const rows = document.querySelectorAll('#khataBody tr');

  // Loop through the rows starting from the second row and ending before the last row
  for (let i = 1; i < rows.length - 1; i++) {
      const currentRow = rows[i];
      const previousRow = rows[i - 1];
      // Get the last element value of the previous row
      const previousRowLastValue = parseInt(previousRow.querySelector('td:last-child').innerText);
      const FirstRowLastValue = parseInt(rows[0].querySelector('td:last-child').innerText);


      // Get the second-last element value of the current row
      const currentRowCredit = parseInt(currentRow.querySelector('td:nth-last-child(3)').innerText) 
      const currentRowDebit = parseInt(currentRow.querySelector('td:nth-last-child(2)').innerText)
      const currentRemaning = parseInt(currentRow.querySelector('td:last-child').innerText)



// Coloring And color Shifting Functionality Start here 
if(FirstRowLastValue > 0){
  // Credit
  currentRow.querySelector('td:nth-last-child(3)').className = "px-4 py-3 w-40 text-sm border editable text-red-700"
  // Debit
  currentRow.querySelector('td:nth-last-child(2)').className = "px-4 py-3 w-40 text-sm border editable text-green-700"
  if (i==1) {
    rows[0].querySelector('td:last-child').className = "px-4 py-3 w-40 text-bold border editable text-black"
  }

}else{
  // Credit
  currentRow.querySelector('td:nth-last-child(3)').className = "px-4 py-3 w-40 text-sm border editable text-green-700"
  // Debit
  currentRow.querySelector('td:nth-last-child(2)').className = "px-4 py-3 w-40 text-sm border editable text-red-700"
  // Making the first remaining Value to Red 
  if (i==1) {
    rows[0].querySelector('td:last-child').className = "px-4 py-3 w-40 text-bold border editable text-red-700"
  }

}
// Coloring And color Shifting Functionality End here 
if(isNaN(currentRowCredit) && isNaN(currentRowDebit) && isNaN(currentRemaning) ){
  break;
}

      const currentRowDebitMinusCredit =  (currentRowDebit || 0) - (currentRowCredit || 0)

      // Calculate the difference
      const difference = previousRowLastValue - currentRowDebitMinusCredit;

      
      // Check if the difference is not NaN
      if (!isNaN(difference)) {
          // Set the difference as the last element value of the current row
          currentRow.querySelector('td:last-child').innerText = difference;
      }

      
      if (parseInt(currentRow.querySelector('td:last-child').innerText) < 0) {
        currentRow.querySelector('td:last-child').className = "px-4 py-3 text-lg border text-red-700 bg-gray-50 editable"
      } else {
        currentRow.querySelector('td:last-child').className = "px-4 py-3 text-lg border text-black bg-gray-50 editable"
      }
  }
}

// function calculateAndSetDifference() {
//   // Get all the rows in the table body
//   const rows = document.querySelectorAll('#khataBody tr');

//   // Loop through the rows starting from the first row and ending before the last row
//   for (let i = 0; i < rows.length; i++) {
//     const currentRow = rows[i];
//     const previousRow = rows[i - 1];
    
//     // Get the last element value of the previous row
//     const previousRowLastValue = previousRow ? parseInt(previousRow.querySelector('td:last-child').innerText) : 0;
//     const FirstRowLastValue = parseInt(rows[0].querySelector('td:last-child').innerText);

//     // Get the second-last element value of the current row
//     const currentRowCreditText = currentRow.querySelector('td:nth-last-child(3)').innerText.trim();
//     const currentRowDebitText = currentRow.querySelector('td:nth-last-child(2)').innerText.trim();
//     const currentRowCredit = currentRowCreditText ? parseInt(currentRowCreditText) : 0;
//     const currentRowDebit = currentRowDebitText ? parseInt(currentRowDebitText) : 0;
//     const currentRemaning = parseInt(currentRow.querySelector('td:last-child').innerText) || 0;

//     // Calculate the difference
//     const currentRowDebitMinusCredit = currentRowDebit - currentRowCredit;
//     const difference = previousRowLastValue - currentRowDebitMinusCredit;

//     // Check if the remaining value is negative and apply class accordingly
//     if (currentRemaning < 0) {
//       currentRow.querySelector('td:last-child').className = "px-4 py-3 w-40 text-bold border editable text-red-700";
//     } else {
//       currentRow.querySelector('td:last-child').className = "px-4 py-3 w-40 text-bold border editable text-black";
//     }

//     // Apply classes based on FirstRowLastValue
//     if (FirstRowLastValue > 0) {
//       currentRow.querySelector('td:nth-last-child(3)').className = "px-4 py-3 w-40 text-sm border editable text-red-700";
//       currentRow.querySelector('td:nth-last-child(2)').className = "px-4 py-3 w-40 text-sm border editable text-green-700";
//     } else {
//       currentRow.querySelector('td:nth-last-child(3)').className = "px-4 py-3 w-40 text-sm border editable text-green-700";
//       currentRow.querySelector('td:nth-last-child(2)').className = "px-4 py-3 w-40 text-sm border editable text-red-700";
//     }

//     // Set the difference as the last element value of the current row
//     currentRow.querySelector('td:last-child').innerText = isNaN(difference) ? '' : difference;

//     // Break loop if credit, debit, and remaining are empty or contain text
//     if (isNaN(currentRowCredit) && isNaN(currentRowDebit) && isNaN(currentRemaning)) {
//       break;
//     }
//   }
// }

// function calculateAndSetDifference(rows) {

//   let previousRowLastValue = 0; // Initialize with 0

//   for (const row of rows) {
//     const currentRowCredit = parseInt(row.querySelector('td:nth-last-child(3)').innerText) || 0;
//     const currentRowDebit = parseInt(row.querySelector('td:nth-last-child(2)').innerText) || 0;

//     // Calculate difference (credit - debit)
//     const difference = currentRowCredit - currentRowDebit;

//     // Calculate remaining value based on previous row
//     const currentRemaning = difference + previousRowLastValue;

//     // Set class names based on difference and first row logic
//     const className = currentRemaning >= 0
//       ? (isFirstRow ? 'text-green-700' : 'text-black') // Positive or zero
//       : 'text-red-700'; // Negative

//     row.querySelector('td:last-child').classList.add(className); // Assuming last cell holds remaining value

//     // Update previous row last value for the next iteration
//     previousRowLastValue = currentRemaning;

//     // Break if all values are NaN (Not a Number)
//     if (isNaN(currentRowCredit) && isNaN(currentRowDebit) && isNaN(currentRemaning)) {
//       break;
//     }
//   }

//   // Handle first row logic (optional)
//   let isFirstRow = true; // Assuming you want to handle first row differently
// }
// const rows = document.querySelectorAll('#khataBody tr');
// Call the function on page load
  calculateAndSetDifference();

// Calculate the Diffrence functionality End here 



// Delete and Save Modals and there function Start here 

// Function to toggle modal visibility
function toggleModal() {
	const modal = document.getElementById('deleteModal');
    modal.classList.toggle('hidden');
}

function handleDelete() {
	toggleModal()
  // rest of the function explains here 
        // Extract CreaterId from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const LedgerId = urlParams.get('LedgerId');
        // If LedgerId is present that mean we are Modifying the Ledger
    if (LedgerId) {
console.log('Delete Call here');


fetch(`https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/${LedgerId}`, {
  method: 'DELETE'
})
.then(response => {
  if (!response.ok) {
    throw new Error('Failed to delete ledger');
  }
  return response.json();
})
.then(data => {

  window.history.back();

})
.catch(error => {
  console.error('Error deleting ledger:', error);
});
}
}
// Toggle save modal visibility
function toggleSaveModal() {
    const modal = document.getElementById('saveModal');
    modal.classList.toggle('hidden');
}

// Handle save action
function handleSave() {
    // Your save action logic here
    let readyToSave = checkValue()

    

    console.log(readyToSave);

 
if (readyToSave) {

  const List = convertToData()
  console.log(List);


  if (List.length) {
       // Extract CreaterId from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const CreaterId = createrID.value
        const LedgerId = urlParams.get('LedgerId');
        // If LedgerId is present that mean we are Modifying the Ledger
    if (LedgerId) {
console.log('modify Call here ');
      ModifyedSaver()

    }if (!LedgerId && CreaterId) {
      console.log("only new Ledger exsisted user");
      const data = {
        CreaterNo: createrID.value,
        List:List ,
        PromisedPaymentDate : PromisedPaymentDate.value
      }
      

      fetch('https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/CreateLedgerByCreaterNo', {
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
        const LedgerIdNew = data.ledger._id
        window.location.replace(`/Ledger.html?LedgerId=${LedgerIdNew}`)
      })
      .catch(error => {
        console.error('Error fetching data from Ledger table:', error);
        throw error; // Re-throw the error for the caller to handle
      });


    }if (!LedgerId && !CreaterId) {
      console.log("this is new Ledger new creater");
      const data = {
        Creater:{
          name: createrName.value,
          officeLocation : createrLocation.value,
          phone : createrPhone.value,
        },
        List:List ,
        PromisedPaymentDate : PromisedPaymentDate.value
      }
      

      fetch('https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/', {
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
        const LedgerIdNew = data._id;
        window.location.replace(`/Ledger.html?LedgerId=${LedgerIdNew}`)
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



// Delete and Save Modals and there function Ends here 







// Attachment Image delete functionality start here 

function removeImage(event, imageName) {
  // Prevent the default behavior of the anchor tag
  event.preventDefault();
  // Get the button's parent <td> element
  const parentTd = event.target.closest('td');



  // Call the DELETE request to delete the image
  fetch(`https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/attachmentImg/delete/${imageName}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      // If the DELETE request is successful, remove the button
      parentTd.innerHTML = '';
      // Set contenteditable attribute of parent <td> to true
      parentTd.setAttribute('contenteditable', 'true');
      ModifyedSaver()
    } else {
      // Handle error responses
      console.error('Error deleting image');
    }
  })
  .catch(error => {
    console.error('Error deleting image:', error);
  });
}


// Attachment Image delete functionality End here 

// Form to json Convert functionality start here 


function convertToData() {
  const table = document.getElementById('LedgerTable');
  const tbody = table.getElementsByTagName('tbody')[0];
  const rows = tbody.getElementsByTagName('tr');

  let data = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName('td');
    const rowData = {};

    let isEmptyRow = true; // Flag to track if all cells in the row are empty

    for (let j = 0; j < cells.length; j++) {
      const fieldName = table.rows[0].cells[j].innerHTML.trim(); // Trim leading and trailing whitespace
      const cell = cells[j]; // Store the entire cell element
      const cellValue = cell.textContent.trim(); // Trim leading and trailing whitespace

      // Check if the cell contains non-empty content
      if (cellValue !== '') {
        isEmptyRow = false;
      }


      // Check if the cell contains an anchor tag
      if (cell.querySelector('a')) {
        const anchor = cell.querySelector('a');

        // Split the URL by '?' to separate the path from the query string
        const urlParts = anchor.href.split('?');

        // Check if there are query parameters
        if (urlParts.length > 1) {
          // Get the query string part (everything after the '?')
          const queryString = urlParts[1];

          // Parse the query string to extract key-value pairs
          const queryParams = new URLSearchParams(queryString);

          // Get the value of the 'id' parameter
          const OrderID = queryParams.get('OrderID');

          rowData[fieldName] = {
            // Extract text content and href attribute of the anchor tag
            OrderID: OrderID
          };

        } else {
          const imageName = anchor.href.split('/').pop();

          rowData[fieldName] = {
            // Extract text content and href attribute of the anchor tag
            ImageName: imageName
          };
        }
      } else {
        rowData[fieldName] = cellValue; // Handle non-anchor cells
      }

      // Storing the date Value
      if (cell.querySelector('input#LedgerListDate')) {

        // console.log(cell.querySelector('input#LedgerListDate').value, fieldName);
        rowData[fieldName] = cell.querySelector('input#LedgerListDate').value

      }
    }

    // Add row data to 'data' array only if the row is not empty
    if (!isEmptyRow) {
      data.push(rowData);
    }
  }

  // Function to format a date as YYYY-MM-DD
  function formatDate(date) {
    var d = new Date(date);
    return [
      d.getFullYear(),
      ('0' + (d.getMonth() + 1)).slice(-2),
      ('0' + d.getDate()).slice(-2)
    ].join('-');
  }

  // Loop over the array and replace empty dates with the current date
  data = data.map(item => {
    if (item.Date == "") {
      item.Date = formatDate(new Date()); // Use the current date if the date is empty
    }
    return item;
  });

  console.log(data);

  return data;
}

// Form to json Convert functionality End here 



// Functionailty to check creater is valid start here 



// Function to add background color to the button
function InputChecker() {
  // Get the values of the input elements
  const nameValue = createrName.value.trim();
  const locationValue = createrLocation.value.trim();
  var phoneValue =  createrPhone.value.trim();
  // var phoneValue =  parseInt( createrPhone.value.trim() )
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
  const parsedPhoneValue = parseInt(phoneValue);
 
  // Prepare the data to be sent in the request body
  const requestBody = {
    CreaterPhone: parsedPhoneValue
  };

  // Make a POST request using the Fetch API
  fetch('https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/CreaterSearchByPhone', {
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
      document.getElementById('previousPaymentTotal').innerText = "Rs : " + numberWithCommas(data.previousRemainingTotal);

      readyToSave = true
  })
  .catch(error => {
      console.log('Phoe NO Not Found:', error);
  });
}

createrPhone.addEventListener('input', searchCreaterByPhone)

// UpDate CreaterInfo by Phone numbr End here 


// Manage Image Functionality start here 
// Auto Upload Image functionality start here
document.getElementById('AttachmentImage').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0]; // Get the selected file
  
  if (!file) return; // No file selected
  

  const formData = new FormData(); // Create FormData object

      // Extract CreaterId from the URL parameters
      // const urlParams = new URLSearchParams(window.location.search);
      // const LedgerId = urlParams.get('LedgerId');


  formData.append('image', file); // Append the file to FormData object with key 'image'
  // formData.append('LedgerId', LedgerId); // Append the file to FormData object with key 'image'
  
  // Make a POST request to the /api/ledger/attachmentImg endpoint
  fetch('https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/attachmentImg', {
    method: 'POST',
    body: formData // Set the FormData as the request body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    return response.json();
  })
  .then(data => {
    console.log('Image uploaded successfully:', data);
    ledgerData = convertToData()
    ledgerData.push({
          Date: "",
          Description: "",
          Note: {
            ImageName: data.filename
          },
          Credit: "0",
          Debit: "0",
          Remaining: "0"
        })
    // Handle the response data as needed
    render(ledgerData)
    calculateAndSetDifference()
    ModifyedSaver()

  })

  .catch(error => {
    console.error('Error uploading image:', error);
  });
}


// Auto Upload Image functionality End here

// Manage Image Functionality End here 


// Modify Save functionAlity start here 
function ModifyedSaver(){


       // Extract CreaterId from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const LedgerId = urlParams.get('LedgerId');
        // Using dataset
        const updatedAt = document.querySelector('.createrInfo').dataset.updatedAt;
        // If LedgerId is present that mean we are Modifying the Ledger
        const List = convertToData()

  const data = {
    LedgerId:LedgerId,
    List:List ,
    PromisedPaymentDate : PromisedPaymentDate.value
  }
  
  
  fetch('https://ledgerbook3-n17dzrms.b4a.run/api/Ledger/UpdateLedger', {
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
      throw new Error('Failed to fetch data from Ledger table');
    }
    return response.json();
  }).then(data => {
    console.log(data);
    window.location.reload()
  })
  .catch(error => {
    console.error('Error Updating data from Ledger table:', error);
    throw error; // Re-throw the error for the caller to handle
  });
}

// Modify Save functionAlity End here 
// Adding Commas to number functionality Start here
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// Adding Commas to number functionality End here


// Printing Ledger funcitonality Start here 

function printSelectedArea() {
  // Get the creator's name from the input field
  var creatorName = document.getElementById('createrName').value;
// Get the content to print
  var table = document.getElementById('LedgerTable');

    // Clone the table to manipulate it without affecting the original table
    var clonedTable = table.cloneNode(true);
    var tbody = clonedTable.getElementsByTagName('tbody')[0];
    var rows = tbody.getElementsByTagName('tr');

    // Loop through the rows in reverse order and remove rows with empty last two cells
    for (var i = rows.length - 1; i >= 0; i--) {
        var cells = rows[i].getElementsByTagName('td');
        var lastCellValue = cells[cells.length - 1].textContent.trim();
        var secondLastCellValue = cells[cells.length - 2].textContent.trim();

                // Check if the last two cells are empty
                if (!lastCellValue && !secondLastCellValue) {
                  tbody.removeChild(rows[i]);
              }

              // Clear the content of the third cell if it contains HTML
              if (cells[2].innerHTML !== cells[2].textContent) {
                  cells[2].innerHTML = '';
              }
    }

  // Create a new window or iframe
  var printWindow = window.open('', '', 'height=500,width=800');


            // Write the cloned table content to the new window
            // printWindow.document.write('<html><head><title>' + createrName.innerText + '</title>');
            printWindow.document.write('<html><head>');
            printWindow.document.write('<link href="./css/tailwind/tailwind@2.2.19.min.css" rel="stylesheet">');
            printWindow.document.write('<link href="./css/index.css" rel="stylesheet">');
            // printWindow.document.write('<style>');
            // printWindow.document.write('@media print { @page { size: A4; margin: 20mm; }');
            // printWindow.document.write('body { -webkit-print-color-adjust: exact; }');
            // printWindow.document.write('#table-to-print { width: 100%; border-collapse: collapse; }');
            // printWindow.document.write('#table-to-print th, #table-to-print td { border: 1px solid #000; padding: 8px; text-align: left; }');
            // printWindow.document.write('#table-to-print th { background-color: #f2f2f2; } }');
            // printWindow.document.write('</style>');
            printWindow.document.write('</head><body >');
            printWindow.document.write('<h2 class="mb-4">Pak Madina Electronics To: ' + creatorName + '</h2>');
            printWindow.document.write(clonedTable.outerHTML);
            printWindow.document.write('</body></html>');


  // Close the document to trigger the print
  printWindow.document.close();

  // Wait for the content to load and then print
  printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
  };
}


// Printing Ledger funcitonality End here 
