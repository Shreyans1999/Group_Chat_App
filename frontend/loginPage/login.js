const SubmitBtn = document.getElementById("submit");
SubmitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const login = {
    email: email,
    password: password,
  };

  axios
    .post(`http://localhost:4000/login-user/${login.email}`, login)
    .then((response) => {
      console.log(response);
      if(response.status == 201) {
        alert("User Loggedin");
        localStorage.setItem("token", response.data.token);
       // window.location.href="frontend\Main\main.html"
       window.location.href = "../Main/main.html";
      }
    })
    .catch((err) => {
      alert(err)
      console.log(err);
    });
  console.log(login.email);
  console.log(login.password);
});


