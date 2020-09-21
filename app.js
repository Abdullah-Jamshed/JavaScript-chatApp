var firebaseConfig = {
    apiKey: "AIzaSyA8vbyQBjFMjo9qoVsrGh17FjckfoRzh3E",
    authDomain: "chat-app-efee3.firebaseapp.com",
    databaseURL: "https://chat-app-efee3.firebaseio.com",
    projectId: "chat-app-efee3",
    storageBucket: "chat-app-efee3.appspot.com",
    messagingSenderId: "425245500060",
    appId: "1:425245500060:web:4567a9a6c2441358ea8359",
    measurementId: "G-LG27WX45PJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var contacts = document.querySelector(".contact ul");
contacts.addEventListener("click", (e) => {
    if (e.target.classList.contains("contact-list-item")) {
        var start = document.querySelector(".start")
        start.style.display = "none"
        var panel = document.querySelector(".chatbox2")
        panel.style.display = "inline-block"
        var inp = document.querySelector(".message-input")
        inp.value = ""

        var code = e.target.getAttribute("code")
        sessionStorage.setItem("chatPartnerCode", code)
        chatPartner(code)

        // var activeLi = document.querySelectorAll(".contact-list-item")
        // Array.from(activeLi).forEach((li) => {
        //     if (li === e.target) {
        //         li.classList.add("active")
        //     } else {
        //         li.classList.remove("active")
        //     }
        // })

        testFunc()
    }
})

var popup = document.querySelector(".pop-up2")
var addPopup = document.querySelector(".add-popup2")
var addContact = document.querySelector(".add-contact")
addContact.addEventListener("click", (e) => {
    addContact.style.visibility = "hidden"
    popup.style.display = "block"
    addPopup.style.display = "block"
})


var cancel = document.querySelector(".fa-times")
cancel.addEventListener("click", (e) => {
    addContact.style.visibility = "visible"
    popup.style.display = "none"
    addPopup.style.display = "none"
})

var form = document.forms["form2"]
form.addEventListener("submit", (e) => {
    e.preventDefault()
    var name = document.querySelector("#name").value
    var code = document.querySelector("#code").value
    addContactToDatabase(name, code);
    addContact.style.visibility = "visible"
    popup.style.display = "none"
    addPopup.style.display = "none"

})

function addContactToDatabase(name, code) {
    var dataKey = firebase.database().ref("users").push().key
    var key = sessionStorage.getItem("key")

    function Contacts(name, code) {
        this.name = name
        this.code = code
    }
    var contact = new Contacts(name, code)
    firebase.database().ref(`users/${key}/contacts/${dataKey}`).set(contact)
}

var login = document.forms["form1"]
login.addEventListener("submit", (e) => {
    e.preventDefault()
    var loginBtn = document.querySelector(".login-btn")
    loginBtn.disabled = true
    matchCode()
})

function matchCode() {
    var code = document.querySelector("#login-code")
    var headerName = document.querySelector(".chatbox-header-name")
    firebase.database().ref(`/users`).orderByChild('code').equalTo(code.value).once("value", (data) => {
        if (code.value !== "") {
            if (data.val() != null) {
                for (prop in data.val()) {
                    sessionStorage.setItem("key", data.val()[prop]["key"])
                    sessionStorage.setItem("code", data.val()[prop]["code"])
                    headerName.textContent = data.val()[prop]["name"]
                }
                fetchDatabase()
                var popup1 = document.querySelector(".pop-up1")
                var addPopup2 = document.querySelector(".add-popup1")
                popup1.style.display = "none"
                addPopup2.style.display = "none"
            } else {
                code.value = ""
                code.style.borderBottom = "1px solid red"
                code.style.outline = "red"
            }
        }
    })
}


function fetchDatabase() {
    var ul = document.querySelector(".contact-ul")
    var key = sessionStorage.getItem("key")
    firebase.database().ref(`/users/${key}/contacts`).on('child_added', function (data) {
        var contactFromDataName = data.val()["name"]
        var contactFromDataCode = data.val()["code"]
        var li = document.createElement("li")
        li.classList.add("contact-list-item")
        var span = document.createElement("span")
        span.classList.add("profile-pic-container2", "contact-list-item")
        var icon = document.createElement("i")
        icon.classList.add("fa", "fa-user")
        var text = document.createTextNode(contactFromDataName)
        span.appendChild(icon)
        li.appendChild(span)
        li.appendChild(text)
        li.setAttribute("code", contactFromDataCode)
        ul.appendChild(li)
    })
}


function chatPartner(code) {
    var key = sessionStorage.getItem("key")
    firebase.database().ref(`users/${key}/contacts`).orderByChild("code").equalTo(code).once("value", (data) => {
        var contactName = document.querySelector(".chatbox-header-2 p")
        for (let prop in data.val()) {
            contactName.textContent = data.val()[prop]["name"]
        }
    })
}


var sentMessage = document.querySelector(".fa-paper-plane")
sentMessage.addEventListener("click", (e) => {
    var input = document.querySelector("#message-text")
    var inputValue = input.value
    if (inputValue !== "") {
        var code = sessionStorage.getItem("code")
        var chatPartnerCode = sessionStorage.getItem("chatPartnerCode")

        function Message() {
            this.content = inputValue
            this.sender = code
            this.to = chatPartnerCode
        }

        var message = new Message(inputValue, code, chatPartnerCode)
        var time = new Date().getTime()
        firebase.database().ref(`messages/${time}/`).set(message)

    }

    input.value = ""

})





function testFunc() {

    var messagePanel = document.querySelector(".message-panel")
    messagePanel.innerHTML = ""
    firebase.database().ref("messages").on("child_added", (data) => {
        var Data = data.val()
        var content = Data["content"]
        var sender = Data["sender"]
        var to = Data["to"]
        var admin = sessionStorage.getItem("code")
        var chatPartner = sessionStorage.getItem("chatPartnerCode")

        if (sender === admin && to === chatPartner) {
            console.log("condition 1");
            var div = document.createElement("div")
            var li = document.createElement("li")
            li.textContent = content
            div.appendChild(li)
            if (sender === admin) {
                div.classList.add("admin-li")
            } else if (sender === chatPartner) {
                div.classList.add("partner-li")
            }
            messagePanel.appendChild(div)
        } else if (sender === chatPartner && to === admin) {
            console.log("condition 2");
            var div = document.createElement("div")
            var li = document.createElement("li")
            li.textContent = content
            div.appendChild(li)
            if (sender === admin) {
                div.classList.add("admin-li")
            } else if (sender === chatPartner) {
                div.classList.add("partner-li")
            }
            messagePanel.appendChild(div)
        }

    })

firebase}


