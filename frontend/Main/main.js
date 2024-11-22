const SendButton = document.getElementById("Send");

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