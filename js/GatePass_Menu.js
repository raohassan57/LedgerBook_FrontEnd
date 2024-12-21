
// document.querySelector('.userMangment').addEventListener('click', async ()=>{




// // Get UserList And Render Functionality Start here
//   const parentDiv = document.querySelectorAll('div.EmailPw')[0].parentElement;
//   let HtmlToAppend = ""
//   try {
//       const response = await fetch('https://ledgerbook3-n17dzrms.b4a.run/api/GatepassMenu/getAllStoreKeepers');
//       const storeKeepers = await response.json();

//       if (response.ok && storeKeepers.length > 0) {
//           storeKeepers.forEach((storeKeeper, index) => {

//               const userHtml = `
//                   <div class="flex pt-4 space-x-6 EmailPw">
//                       <div class="flex items-end pb-2">
//                           <span class="font-md text-xl text-gray-500">
//                               ${index + 1}  :
//                           </span>
//                       </div>
//                       <div>
//                           <label class="block text-sm text-gray-700">User ID</label>
//                           <input type="text" name="User_ID" value="${storeKeeper?.UserName}" onInput="ThirtyCharacterLimit(event)" placeholder="Enter User ID" class="w-full px-4 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-700 focus:bg-white focus:outline-none"  autocomplete required>
//                       </div>
//                       <div class="ml-8">
//                           <label class="block text-sm text-gray-700">Password</label>
//                           <input type="Password" onfocus="PasswordFieldToggle(event)" onblur="PasswordFieldToggle(event)" name="Password" value="${storeKeeper?.Password}" onInput="ThirtyCharacterLimit(event)" placeholder="Enter Password" minlength="6" class="w-full px-4 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-700 focus:bg-white focus:outline-none" required>
//                       </div>
//                   </div>
//               `;
//               // Storeing Html to OverWrite in parentDiv 
//               HtmlToAppend += userHtml;
//           });

//           // Assigning the Html to parentDiv 
//           parentDiv.innerHTML = HtmlToAppend
//       } else {
//         console.log("No StoreKeeper users found.");
//       }
//   } catch (error) {
//       console.error('Error fetching store keepers:', error);
//   }


// })
// Get UserList And Render Functionality End here



// // Scrolling Feature Start here 
// function setupScrolling() {
//   const buttons = document.querySelectorAll('.nav-button');
//   const sectionContainer = document.querySelector('.sectionContainer');
  
//   buttons.forEach((button, index) => {
//     button.addEventListener('click', () => {
//       sectionContainer.scrollTo({
//         top: index * window.innerHeight,
//         behavior: 'smooth'
//       });
//     });
//   });




// // Disable scroll on mouse wheel
// sectionContainer.addEventListener('wheel', (event) => {
//   const userCard = sectionContainer.querySelector('.UserCard');

//     // Allow scroll for UserCard elements while preventing scroll for sectionContainer
//   if (event.target.closest('.UserCard')) {
//     // Allow scroll for UserCard elements

//     const deltaY = event.deltaY;
//     const scrollTop = userCard.scrollTop;
//     const scrollHeight = userCard.scrollHeight;
//     const clientHeight = userCard.clientHeight;
//     if (
//       (deltaY < 0 && scrollTop === 0) || // Scrolling up at the top
//       (deltaY > 0 && scrollTop + clientHeight >= scrollHeight) // Scrolling down at the bottom
//     ) {
//       event.preventDefault(); // Stop propagation to prevent scroll on sectionContainer
//     }

//     return;
//   }


//   const GatepssListContainer = sectionContainer.querySelector('.GatepssList-container tableContainer');

//     // Allow scroll for UserCard elements while preventing scroll for sectionContainer
//   if (event.target.closest('.GatepssList-container')) {
//     // Allow scroll for UserCard elements

//     const deltaY = event.deltaY;
//     const scrollTop = GatepssListContainer.scrollTop;
//     const scrollHeight = GatepssListContainer.scrollHeight;
//     const clientHeight = GatepssListContainer.clientHeight;
//     console.log(deltaY,scrollTop,clientHeight,scrollHeight);
//     if (
//       (deltaY < 0 && scrollTop === 0) || // Scrolling up at the top
//       (deltaY > 0 && scrollTop + clientHeight >= scrollHeight) // Scrolling down at the bottom
//     ) {
//       event.preventDefault(); // Stop propagation to prevent scroll on sectionContainer
//     }

//     return;
//   }





//   // Prevent scroll for sectionContainer
//   event.preventDefault();
// }, { passive: false });









// }

// document.addEventListener('DOMContentLoaded', setupScrolling);






// Scrolling Feature End here 

// Add User functionality Start here

  // Get all div elements with the class EmailPw
//   const emailPwDivs = document.querySelectorAll('div.EmailPw');
//   const parentDiv = emailPwDivs[0].parentElement;
//   const addUserBtn = document.getElementById('AddUserBtn');

//   function AddUser() {
//     const userNo = document.querySelectorAll('div.EmailPw').length + 1

//     // Check if there are any elements with the EmailPw class
//     if (emailPwDivs.length > 0) {

      
//         // Create a new div element
//         const newDiv = document.createElement('div');
//         newDiv.classList.add('flex', 'pt-12', 'space-x-6', 'EmailPw');


//         newDiv.innerHTML =`

//       <div class="flex items-end pb-2">
//           <span class="font-md text-xl text-gray-500">
//               ${userNo}  :
//           </span>
//       </div>
//       <div>
//           <label class="block text-sm  text-gray-700">User ID</label>
//           <input type="email" onInput="ThirtyCharacterLimit(event)" name="User_ID" placeholder="Enter User ID" class="w-full px-4 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-700 focus:bg-white focus:outline-none"  autocomplete required>
//       </div>
      
//       <div class="ml-8">
//           <label class="block text-sm  text-gray-700">Password</label>
//           <input type="Password" onfocus="PasswordFieldToggle(event)" onblur="PasswordFieldToggle(event)" onInput="ThirtyCharacterLimit(event)" name="Password" placeholder="Enter Password" minlength="6" class="w-full px-4 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-700
//               focus:bg-white focus:outline-none" required>
//       </div>
// `     

      
//         // Append the new div to the parent element
//         parentDiv.appendChild(newDiv);
      
//     }
//   }


// addUserBtn.addEventListener('click', AddUser );



// Add User functionality End here

// SaveChanges functionality Start here

// // Function to save changes
// async function SaveChanges() {
//   const emailPwDivs = document.querySelectorAll('.EmailPw');
//   const UserList = [];

//   emailPwDivs.forEach((div) => {
//       const UserName = div.querySelector('input[name="User_ID"]').value.trim()
//       const Password = div.querySelector('input[name="Password"]').value.trim()

//       if (UserName && Password) {

//           const user = {
//               UserName,
//               Password
//           };
//           UserList.push(user);
//       }
//   });


  
// if (UserList.length > 0) {
  
//   try {
//     const response = await fetch('https://ledgerbook3-n17dzrms.b4a.run/api/GatepassMenu/UserChangesSave', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({UserList})
//     });

//     if (response.ok) {
//         // If the request is successful, reload the page
//         window.location.reload();
//     } else {
//         const result = await response.json();
//         console.error('Error:', result.message);
//     }
// } catch (error) {
//     console.error('An error occurred:', error);
// }




// }



// };

// // Attach SaveChanges function to button click event
// const saveChangesBtn = document.getElementById('SaveChangesBtn');
// saveChangesBtn.addEventListener('click', SaveChanges);


// // SaveChanges functionality End here
// // Apply 30 CharacterLimit for Inputs Funcitonality Start here
// function ThirtyCharacterLimit(event){

// // setting the value after appling the limit 
// event.target.value = event.target.value.trim().slice(0, 36) // Limit to 36 characters and trim

// }

// // Apply 30 CharacterLimit for Inputs Funcitonality End here
// // Apply Passowrd Field View Toggle Functionality Start here
// function PasswordFieldToggle(event) {
//   const passwordField = event.target;
//   if (event.type === 'focus') {
//       passwordField.type = 'text';
//   } else if (event.type === 'blur') {
//       passwordField.type = 'password';
//   }
// }




// Apply Passowrd Field View Toggle Functionality End here


// Time Selection Box functionality Start here


// Time Selection Box functionality End here
// Get All GatePass functionality Start here 

document.addEventListener('DOMContentLoaded', () => {
    const periodSelect = document.getElementById('Period');
    const tableSearch = document.getElementById('table-search');

    const fetchGatePasses = async (days, query) => {
        try {
            const response = await fetch('https://ledgerbook3-n17dzrms.b4a.run/api/GatepassMenu/GetAllGatePassStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Days: days, Query: query })
            });

            if (response.ok) {
                const data = await response.json();
                renderTableRows(data);
            } else {
                console.error('Failed to fetch gate passes');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderTableRows = (data) => {
        const TableBody = document.querySelector('.GatepssList-container table tbody');
        TableBody.innerHTML = ''; // Clear existing rows
        let DatatoInsert = ''
        data.forEach((item, index) => {
            console.log(item.DeliveryDetails);
            const row = `
            <tr class="bg-white border-b hover:bg-gray-50">
            <th scope="row" class="px-6 py-4 font-medium text-gray-600">
                ${item?.GatePassNO}
            </th>
            <th scope="row" class="px-6 py-4 font-medium text-gray-600">
                ${item?.DeliveryDetails?.ShopName}
            </th>
            <th class="px-6 py-4 text-sm font-normal">
                ${item?.DeliveryDetails?.ShopLocation}
            </th>
            <td class="px-6 py-4">
            ${item?.DeliveryDetails?.PrintingTime ? formatDateTime(item?.DeliveryDetails?.PrintingTime) : 'Not Yet'}
            </td>
            <td class="flex items-center px-6 py-4">
                <a href="./GatePass.html?GatePassID=${item._id}" target="_blank" class="font-medium text-blue-600 hover:underline">Open</a>
            </td>
        </tr>
            `;

            DatatoInsert += row;
        });
        TableBody.innerHTML = DatatoInsert;
    };

    // Fetch data on load without any parameters
    fetchGatePasses();

    // Event listener for period select
    periodSelect.addEventListener('change', () => {
        const selectedPeriod = periodSelect.value;
        fetchGatePasses(selectedPeriod, tableSearch.value);
    });

    // Event listener for table search input
    tableSearch.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            fetchGatePasses(periodSelect.value, tableSearch.value);
        }
    });
});


const formatDateTime = (date) => {
    date = new Date(date)
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const time = date.toLocaleTimeString('en-US', options);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2);

    return `${time} | ${day}/${month}/${year}`;
};


// Get All GatePass functionality End here 
