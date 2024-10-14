const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone=document.getElementById("phone").value;

  const RegisterUser = {
    name: name,
    email: email,
    password: password,
    phone:phone
  };
  if (name && email && password) {
    axios
      .post("http://localhost:4000/register-user", RegisterUser)
      .then((response) => {
        console.log(response);
        alert("Signup Successfull");
        window.location.href = "../login/login.html";
      })
      .catch((err) => console.log(err));
  } else {
    alert("Fill all detail");
  }
});