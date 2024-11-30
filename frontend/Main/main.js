const SendButton = document.getElementById("Send");

function showMembers(peeps) {
  const UserDiv = document.getElementById("user");
  const Child = document.createElement("span");
  Child.textContent = `${peeps.name}  `;
  Child.id = `${peeps.id}`;
  console.log(Child.id);
  Child.name = `${peeps.name}`;
  const Btn1 = document.createElement("button");
  Btn1.textContent = "RemoveUser";
  Btn1.style.margin = "3px";
  Btn1.style.color = "Red";

  const Btn2 = document.createElement("button");
  Btn2.textContent = "MakeAdmin";
  Btn2.style.margin = "3px";
  Btn2.style.color = "Green";

  Child.appendChild(Btn1);
  Child.appendChild(Btn2);
  UserDiv.appendChild(Child);

  Btn1.addEventListener("click", function removeUser() {
    console.log(Child.id);
    axios.delete(`http://localhost:4000/RemoveMember/${Child.id}`).then(() => {
      alert("user removed from group");
      location.reload();
    });
  });

  Btn2.addEventListener("click", function MakeAdmin() {
    const token = localStorage.getItem("token");
    console.log(Child.name)
    const Admin = {
      status: true,
    };
    axios
      .post(`http://localhost:4000/MakeAdmin/${Child.id}/${Child.name}`, Admin, {
        headers: { Authorisation: token },
      })
      .then(() => {
        alert("Admin made successfully");
        location.reload();
      });
  });
}

window.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  console.log(decodedToken);

  axios
    .get("http://localhost:4000/showMembers", {
      headers: { Authorisation: token },
    })
    .then((Response) => {
      console.log(Response);
      if (decodedToken.admin) {
        for (var i = 0; i < Response.data.peopeles.length; i++) {
          showMembers(Response.data.peopeles[i]);
        }
      }
    });

  // Retrieve and display the group name from local storage
  const groupName = localStorage.getItem("GroupName");
  if (groupName) {
    ShowGroupName(groupName);
  }

  setInterval(() => {
    const groupId = localStorage.getItem("Gid");

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
          TempList.innerHTML += `<li><button onClick="handleGrpNameClick(this.id, '${group.name}')" id="${group.id}"> ${group.name}</button> </li>`;
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
  // Store the group name in local storage
  localStorage.setItem("GroupName", Group);
}

function handleGrpNameClick(id, groupName) {
  localStorage.removeItem("Messages");
  localStorage.setItem("Gid", id);
  ShowGroupName(groupName); // Call ShowGroupName immediately after setting the group ID
}

const Invite = document.getElementById("InviteUser");

Invite.addEventListener("click", function () {
  window.location.href = "../Invite/invite.html";
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