

const btn = document.getElementById("submit");
btn.addEventListener("click", function (e) {
  e.preventDefault()
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const User = {
    name: name,
    email: email,
    phone: phone,
  };
  if(name&&email&&phone){
    const token = localStorage.getItem("token");
    axios.post("http://localhost:4000/InviteUser", User, {
      headers: { Authorisation: token },
    }).then((response)=>{
      console.log(response)
      if(response.status==201){
        alert("INVITE SENT")
        window.location.href='../Main/main.html'
      }
    }).catch((err)=>{
      if(err.status==404){
        alert("User not found");
      }
    });
  }
  else{
    alert("Fill all details");
  }
  
});