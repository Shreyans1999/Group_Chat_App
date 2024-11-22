const SendButton = document.getElementById("Send");

window.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  setInterval(() => {
    const groupId = localStorage.getItem("Gid");
    if (!groupId) return; // Exit if no group is selected

    axios
      .get(`http://localhost:4000/get-message?groupId=${groupId}`, {
        headers: {
          Authorisation: token,
        },
      })
      .then((response) => {
        console.log(response);
        const messages = response.data.messages;

        if (messages.length > 0) {
          ShowGroupName(messages[0].Group.name);
          let MessageArr1 = [];
          const MessageDiv = document.getElementById("message");
          MessageDiv.textContent = "";

          messages.forEach((message) => {
            MessageArr1.push(message);
          });

          // Limit messages to the last 10
          if (MessageArr1.length > 10) {
            MessageArr1 = MessageArr1.slice(-10);
          }

          localStorage.setItem("Messages", JSON.stringify(MessageArr1));

          MessageArr1.forEach((msg) => {
            ShowMessages(msg);
          });
        } else {
          const MessageDiv = document.getElementById("message");
          MessageDiv.innerHTML = "<h1>Start Chatting</h1>";
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:4000/getGroupList", {
        headers: {
          Authorisation: token,
        },
      })
      .then((response2) => {
        console.log(response2);
        const Grouplist = document.getElementById("groupList");
        const TempList = document.createElement("div");
        TempList.innerHTML = "";
        response2.data.name.forEach((group) => {
          TempList.innerHTML += `<li><button onClick="handleGrpNameClick(this.id)" id="${group.id}"> ${group.name}</button> </li>`;
        });

        if (Grouplist.innerHTML !== TempList.innerHTML) {
          Grouplist.innerHTML = TempList.innerHTML;
        }
      });
  }, 1000);
});

SendButton.addEventListener("click", function () {
  const token = localStorage.getItem("token");
  const MessageContent = document.getElementById("messageContent").value;
  const groupId = localStorage.getItem("Gid");
  const Text = {
    Message: MessageContent,
    groupId: groupId, // Make sure to send the groupId with the message
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

function ShowMessages(message) {
  const MessageDiv = document.getElementById("message");
  const Li = document.createElement("li");
  Li.textContent = `${message.User.name} : ${message.content}`;
  MessageDiv.appendChild(Li);
}

const CreateGroup = document.getElementById("CreateGroup");

CreateGroup.addEventListener("click", function () {
  window.location.href = "../GroupEntryPoint/entry.html";
});

function ShowGroupName(Group) {
  const GName = document.getElementById("groupName");
  GName.textContent = `${Group}`;
}

function handleGrpNameClick(id) {
  localStorage.removeItem("Messages");
  localStorage.setItem("Gid", id);
}

const Invite=document.getElementById("InviteUser");

Invite.addEventListener("click",function(){
  window.location.href="../Invite/invite.html"
});


function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}