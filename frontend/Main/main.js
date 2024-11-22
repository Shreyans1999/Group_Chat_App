const SendButton = document.getElementById("Send");

window.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  axios.get("http://localhost:4000/get-message", {
    headers: {
      Authorisation: token,
    },
  }).then(response=>{
    for(var i=0;i<response.data.messages.length;i++){
        console.log(response.data.messages[i].content)
    }
    
  }).catch(err=>{
    console.log(err)
  });
});

SendButton.addEventListener("click", function () {
  const token = localStorage.getItem("token");
  const MessageContent = document.getElementById("messageContent").value;
  const Text = {
    Message: MessageContent,
  };
  axios
    .post("http://localhost:4000/add-message", Text, {
      headers: { Authorisation: token },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

function ShowMessages(){
    
}