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


var createAccount = document.querySelector(".create-btn")
createAccount.addEventListener("click", () => {
    var doneBtn = document.querySelector(".done-btn")
    doneBtn.disabled = false
    var addPopup2 = document.querySelector(".add-popup1")
    var addPopup3 = document.querySelector(".add-popup3")
    addPopup2.style.display = "none"
    addPopup3.style.display = "block"
})

var backBtn = document.querySelector(".back-btn")
backBtn.addEventListener("click", () => {
    var addPopup2 = document.querySelector(".add-popup1")
    var addPopup3 = document.querySelector(".add-popup3")
    addPopup2.style.display = "block"
    addPopup3.style.display = "none"
})


var form3 = document.forms["form3"]
form3.addEventListener("submit", (e) => {
    e.preventDefault()
    var name = document.querySelector("#nameCreate").value
    var phone = document.querySelector("#phoneNum").value
    var key = firebase.database().ref("users").push().key
    var obj = { "name": name, "code": phone, "key": key }

    firebase.database().ref(`/users`).orderByChild('code').equalTo(phone).once("value", (data) => {
        if (data.val() == null) {
            console.log("inside");
            if (name !== "" && phone !== "") {
                var doneBtn = document.querySelector(".done-btn")
                doneBtn.disabled = true
                firebase.database().ref(`users/${key}`).set(obj)
                sessionStorage.setItem("key", key)
                sessionStorage.setItem("code", phone)

                firebase.database().ref(`/users`).orderByChild('code').equalTo(phone).once("value", (data) => {
                    if (data.val() != null) {
                        var popup1 = document.querySelector(".pop-up1")
                        var addPopup1 = document.querySelector(".add-popup1")
                        var addPopup3 = document.querySelector(".add-popup3")
                        addPopup1.style.display = "none"
                        addPopup3.style.display = "none"
                        popup1.style.display = "none"
                        var headerName = document.querySelector(".chatbox-header-name")
                        for (prop in data.val()) {
                            headerName.textContent = data.val()[prop]["name"]
                        }
                        fetchDatabase()
                    }
                })
            }
        }else{
            var h3 = document.createElement("h3")
            h3.textContent = "Already Created"
            form3.prepend(h3)
        }
    })
})



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


var popup = document.querySelector(".pop-up2")
var addPopup = document.querySelector(".add-popup2")
var addContact = document.querySelector(".add-contact")
addContact.addEventListener("click", () => {
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


function chatPartner(code) {
    var key = sessionStorage.getItem("key")
    firebase.database().ref(`users/${key}/contacts`).orderByChild("code").equalTo(code).once("value", (data) => {
        var contactName = document.querySelector(".chatbox-header-2 p")
        for (let prop in data.val()) {
            contactName.textContent = data.val()[prop]["name"]
        }
    })
}

var contacts = document.querySelector(".contact ul");
contacts.addEventListener("click", (e) => {
    if (e.target.classList.contains("contact-list-item")) {
        var messagePanel = document.querySelector(".message-panel")
        messagePanel.innerHTML = ""
        var start = document.querySelector(".start")
        start.style.display = "none"
        var panel = document.querySelector(".chatbox2")
        panel.style.display = "inline-block"
        var inp = document.querySelector(".message-input")
        inp.value = ""

        var code = e.target.getAttribute("code")
        sessionStorage.setItem("chatPartnerCode", code)
        chatPartner(code)
        firstRender()
        // var adminKey = sessionStorage.getItem("key")
        // var obj = { "code": code }
        // firebase.database().ref(`users/${adminKey}/currentConnect/`).update(obj)
    }
})



var sentMessage = document.querySelector(".fa-paper-plane")
sentMessage.addEventListener("click", () => {
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

        lastMessage()
    }

    input.value = ""
})


function lastMessage() {
    var messagePanel = document.querySelector(".message-panel")
    var admin = sessionStorage.getItem("code")
    var chatPartner = sessionStorage.getItem("chatPartnerCode")
    firebase.database().ref("messages").orderByChild("sender").equalTo(admin).limitToLast(1).once("value", (data) => {
        let Data = data.val()
        for (let prop in data.val()) {
            let content = Data[prop]["content"]
            let sender = Data[prop]["sender"]
            let to = Data[prop]["to"]
            if (sender === admin && to === chatPartner) {
                var div = document.createElement("div")
                var li = document.createElement("li")
                li.textContent = content
                div.appendChild(li)
                div.classList.add("admin-li")
                messagePanel.appendChild(div)
            }
        }
    })
}



function firstRender() {
    var messagePanel = document.querySelector(".message-panel")
    messagePanel.innerHTML = ""
    var admin = sessionStorage.getItem("code")
    var chatPartner = sessionStorage.getItem("chatPartnerCode")
    firebase.database().ref("messages").once("value", (data) => {
        var Data = data.val()
        for (let props in Data) {
            var content = Data[props]["content"]
            var sender = Data[props]["sender"]
            var to = Data[props]["to"]

            if (sender === admin && to === chatPartner) {
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
        }


    })
}


var admin = sessionStorage.getItem("code")
var chatPartnerCode = sessionStorage.getItem("chatPartnerCode")
var messagePanel = document.querySelector(".message-panel")
firebase.database().ref("messages").limitToLast(1).on("child_added", (data) => {
    var Data = data.val()
    var content = Data["content"]
    var sender = Data["sender"]
    var to = Data["to"]

    if (sender === admin && to === chatPartnerCode) {
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
    } else if (sender === chatPartnerCode && to === admin) {
        var div = document.createElement("div")
        var li = document.createElement("li")
        li.textContent = content
        div.appendChild(li)
        if (sender === admin) {
            div.classList.add("admin-li")
        } else if (sender === chatPartnerCode) {
            div.classList.add("partner-li")
        }
        messagePanel.appendChild(div)
    }
})