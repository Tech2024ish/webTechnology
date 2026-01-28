document.querySelectorAll(".course").forEach((course) => {
  const tabs = course.querySelectorAll(".tab");
  const registerForm = course.querySelector(".register-form");
  const loginForm = course.querySelector(".login-form");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.tab === "register") {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        clearFormMessages(registerForm);
        clearFormMessages(loginForm);
      } else {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        clearFormMessages(registerForm);
        clearFormMessages(loginForm);
      }
    });
  });
});

function clearFormMessages(form) {
  form.querySelectorAll(".error").forEach((e) => {
    e.style.display = "none";
    e.textContent = "";
  });
  const success = form.querySelector(".success");
  if (success) {
    success.style.display = "none";
    success.textContent = "";
  }
}

function validateRegisterForm(form) {
  let valid = true;
  const fullname = form.fullname.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  clearFormMessages(form);

  if (fullname === "") {
    showError(form.fullname, "Full Name is required.");
    valid = false;
  }
  if (email === "") {
    showError(form.email, "Email is required.");
    valid = false;
  } else if (!validateEmail(email)) {
    showError(form.email, "Email is not valid.");
    valid = false;
  }
  if (password === "") {
    showError(form.password, "Password is required.");
    valid = false;
  } else if (password.length < 6) {
    showError(form.password, "Password must be at least 6 characters.");
    valid = false;
  }
  return valid;
}

function validateLoginForm(form) {
  let valid = true;
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  clearFormMessages(form);

  if (email === "") {
    showError(form.email, "Email is required.");
    valid = false;
  } else if (!validateEmail(email)) {
    showError(form.email, "Email is not valid.");
    valid = false;
  }
  if (password === "") {
    showError(form.password, "Password is required.");
    valid = false;
  }
  return valid;
}

function showError(input, message) {
  const errorDiv = input.nextElementSibling;
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getUsers(course) {
  const usersJSON = localStorage.getItem("devacademy_" + course);
  return usersJSON ? JSON.parse(usersJSON) : [];
}

function saveUsers(course, users) {
  localStorage.setItem("devacademy_" + course, JSON.stringify(users));
}

function handleCourseRegister(event, course) {
  event.preventDefault();
  const form = event.target;
  if (!validateRegisterForm(form)) return;

  const fullname = form.fullname.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  let users = getUsers(course);

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    showError(form.email, "Email is already registered.");
    return;
  }

  users.push({ fullname, email, password });
  saveUsers(course, users);

  clearFormMessages(form);
  form.reset();
  const success = form.querySelector(".success");
  success.textContent = "Registration successful! You can now log in.";
  success.style.display = "block";
}

function handleCourseLogin(event, course) {
  event.preventDefault();
  const form = event.target;
  if (!validateLoginForm(form)) return;

  const email = form.email.value.trim();
  const password = form.password.value.trim();

  const users = getUsers(course);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  clearFormMessages(form);

  if (!user) {
    showError(form.email, "Email not found. Please register first.");
    return;
  }

  if (user.password !== password) {
    showError(form.password, "Incorrect password.");
    return;
  }

  form.reset();
  const success = form.querySelector(".success");
  success.textContent = `Welcome back, ${user.fullname}! You are logged into the ${course} course.`;
  success.style.display = "block";
}

function handleSubmit(event) {
  event.preventDefault();

  let hasError = false;
  document
    .querySelectorAll(".error")
    .forEach((el) => (el.style.display = "none"));
  document.getElementById("successMessage").style.display = "none";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name) {
    document.getElementById("nameError").style.display = "block";
    hasError = true;
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById("emailError").style.display = "block";
    hasError = true;
  }

  if (!message) {
    document.getElementById("messageError").style.display = "block";
    hasError = true;
  }

  if (!hasError) {
    document.getElementById("successMessage").style.display = "block";
    document.getElementById("contactForm").reset();
  }
}
