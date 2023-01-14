
userForm.name.addEventListener('keyup', (e) => validateField(e.target));
userForm.name.addEventListener('blur', (e) => validateField(e.target));

userForm.email.addEventListener('input', (e) => validateField(e.target));
userForm.email.addEventListener('blur', (e) => validateField(e.target));

userForm.password.addEventListener('input', (e) => validateField(e.target));
userForm.password.addEventListener('blur', (e) => validateField(e.target));

userForm.dueDate.addEventListener('input', (e) => validateField(e.target));
userForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

userForm.addEventListener('submit', onSubmit);

const allUsersListElement = document.getElementById('allUsersList');

let nameValid = true;
let emailValid = true;
let passwordValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/users');

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  switch (name) {
    case 'name': {
      if (value.length < 2) {
        nameValid = false;
        validationMessage = "The field 'First & last name' must contain at least 2 characters.";
      } else if (value.length > 100) {
        nameValid = false;
        validationMessage =
        "The 'First & last name' field cannot contain more than 100 characters.";
      } else {
        nameValid = true;
      }
      break;
    }
    case 'email': {
      if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(value)) {
        emailValid = false;
        validationMessage = "Please enter a valid email address.";
      } else {
        emailValid = true;
      }
      break;
    }
    case 'password': {
      if (value.length < 8) {
        passwordValid = false;
        validationMessage = "The password must contain at least 8 characters.";
      } else if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        passwordValid = false;
        validationMessage = "The password must contain at least one lowercase letter, one uppercase letter, and one number.";
      } else {
        passwordValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "The field 'Completed latest' is mandatory.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (nameValid && emailValid && passwordValid && dueDateValid) {
    console.log('Submit');
    saveUser();
  }
}

function saveUser() {
  const user = {
    name: userForm.name.value,
    email: userForm.email.value,
    password: userForm.password.value,
    dueDate: userForm.dueDate.value,
  };
  api.create(user).then((user) => {
    if (user) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');
  api.getAll().then((users) => {
    allUsersListElement.innerHTML = ' ';
    if (users && users.length > 0) {
      sortDueDate(users);
      /*sortFinished(users);*/
      users.forEach((user) => {
        allUsersListElement.insertAdjacentHTML('beforeend', renderUser(user));
      });
    }
  }); 
}


function renderUser({ id, name, email, password, dueDate}) {
  let html = `
    <li class="select-none mt-2 py-4 border-b border-amber-300">
      <div class="flex items-center" id=${id}>
          <div class="flex-1 w-50%">
            <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${name}</h3>
            <p class="mb-3 flex-1 font-bold text-blue-600 ">E-mail: ${email}</p>
            <p class="mb-3 flex-1 font-bold text-blue-600 ">Pass: ${password}</p>
          </div>
            <span>${dueDate}</span>
            <button onclick="deleteUser(${id})" class="inline-block bg-red-500 text-xs text-black-200 border border-white px-5 py-2 rounded-md ml-2">Delete</button>
        </div>
      </div>`;


    /*description &&

      (html += `
        <p class="ml-8 mt-2 text-xs italic">${description}</p>
    `);*/

    html += `</li>`;
  return html;
}

function deleteUser(id) {

  api.remove(id).then((result) => {

    renderList();
  });
}


function updateTask(id){
  api.update(id).then((result)=>{
    renderList()
  });
}

function sortDueDate(tasks){
  tasks.sort ((a, b)=>{
    if (a.dueDate < b.dueDate){
      return-1;
    }
    else if(a.dueDate > b.dueDate){
      return 1;
    }
    else{
      return 0;
    }
  });
}

renderList();
