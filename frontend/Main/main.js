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
      }).catch(err=>{
        console.log(err)
      });
  });
}

// Initialize socket connection
let socket;
try {
  socket = io('http://localhost:4000');
} catch (error) {
  console.error('Socket connection failed:', error);
}

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket server');
});

// Replace the setInterval block with socket listeners
window.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const groupId = localStorage.getItem("Gid");

  // Join the group's socket room
  if (groupId) {
    socket.emit('join-group', groupId);
  }

  // Listen for new messages
  socket.on('receive-message', (message) => {
    ShowMessages(message);
  });

  // Initial message load
  axios.get(`http://localhost:4000/get-message?groupId=${groupId}`, {
    headers: {
      Authorisation: token,
    },
  })
  .then((response) => {
    const messages = response.data.messages;
    messages.forEach(message => {
      if (message.User && message.User.name) {
        ShowMessages({
          content: message.content,
          User: { name: message.User.name }
        });
      }
    });
  });

  // Update group list periodically (can be optimized further)
  getGroupList();
});

// Update the SendButton click handler
SendButton.addEventListener("click", function () {
  const token = localStorage.getItem("token");
  const MessageContent = document.getElementById("messageContent").value;
  const groupId = localStorage.getItem("Gid");

  const Text = {
    Message: MessageContent,
    groupId: groupId,
  };

  // Emit the message through socket
  socket.emit('send-message', {
    content: MessageContent,
    User: { 
      name: localStorage.getItem("username")
    },
    groupId: groupId
  });

  axios.post("http://localhost:4000/add-message", Text, {
    headers: { Authorisation: token },
  });

  // Clear input field
  document.getElementById("messageContent").value = '';
});

// Handle group changes
function handleGrpNameClick(id, groupName) {
  // Leave previous group
  const oldGroupId = localStorage.getItem("Gid");
  if (oldGroupId) {
    socket.emit('leave-group', oldGroupId);
  }

  localStorage.removeItem("Messages");
  localStorage.setItem("Gid", id);
  
  // Join new group
  socket.emit('join-group', id);
  ShowGroupName(groupName);
}

function ShowMessages(message) {
  if (!message.User || !message.User.name) return;
  
  const MessageDiv = document.getElementById("message");
  const Li = document.createElement("li");
  Li.classList.add("mb-2", "p-2", "bg-gray-50", "rounded");

  if (message.type === 'image') {
    const img = document.createElement('img');
    img.src = message.content;
    img.classList.add('max-w-xs', 'rounded');
    Li.appendChild(img);
  } else if (message.type === 'video') {
    const video = document.createElement('video');
    video.src = message.content;
    video.controls = true;
    video.classList.add('max-w-xs', 'rounded');
    Li.appendChild(video);
  } else {
    Li.textContent = `${message.User.name}: ${message.content}`;
  }

  MessageDiv.appendChild(Li);
  MessageDiv.scrollTop = MessageDiv.scrollHeight;
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

function getGroupList() {
  const token = localStorage.getItem("token");
  axios.get("http://localhost:4000/getGroupList", {
    headers: { Authorisation: token },
  })
  .then((response) => {
    const Grouplist = document.getElementById("groupList");
    const TempList = document.createElement("div");
    TempList.innerHTML = "";
    response.data.name.forEach((group) => {
      TempList.innerHTML += `<li><button onClick="handleGrpNameClick('${group.id}', '${group.name}')" id="${group.id}"> ${group.name}</button> </li>`;
    });

    if (Grouplist.innerHTML !== TempList.innerHTML) {
      Grouplist.innerHTML = TempList.innerHTML;
    }
  })
  .catch(err => console.log(err));
}

// Add after socket initialization
const attachMediaButton = document.getElementById('attachMedia');
const mediaInput = document.getElementById('mediaInput');

attachMediaButton.addEventListener('click', () => {
  mediaInput.click();
});

mediaInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const mediaData = e.target.result;
    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
    
    // Emit media message through socket
    socket.emit('send-message', {
      content: mediaData,
      type: mediaType,
      User: { 
        name: localStorage.getItem("username")
      },
      groupId: localStorage.getItem("Gid")
    });

    // Send to backend
    const formData = new FormData();
    formData.append('media', file);
    formData.append('groupId', localStorage.getItem("Gid"));
    formData.append('type', mediaType);

    axios.post("http://localhost:4000/add-media-message", formData, {
      headers: { 
        'Authorisation': localStorage.getItem("token"),
        'Content-Type': 'multipart/form-data'
      }
    });
  };
  reader.readAsDataURL(file);
});