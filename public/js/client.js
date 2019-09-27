let JWT = ''
let SUPPORT_NUMBER = ''
let applicationObj = null
let currentCall = null
let btnCall = null

document.addEventListener('DOMContentLoaded', (event) => {
  btnCall = document.getElementById("btnCall")
  init()
})

function init() {
  const http = new XMLHttpRequest()
  http.open('GET', '/auth/supportuser', true)
  http.onreadystatechange = function () {
    if (http.readyState === 4 && http.status === 200 && http.responseText) {
      console.log(http.responseText)
      const authdata = JSON.parse(http.responseText)
      JWT = authdata.credentials
      SUPPORT_NUMBER = authdata.number
      client = new NexmoClient()
        .login(JWT)
        .then(application => {
          applicationObj = application
          console.log(`You've logged in with the user ${applicationObj.me.name}`)
          applicationObj.on("member:call", (member, call) => {
            currentCall = call
            btnCall.className = "button-hangup"
            btnCall.innerHTML = "Hang Up"
            btnCall.removeEventListener('click', callSupport)
            btnCall.addEventListener('click', terminateCall)
          })
        })
        .catch(errorLogger)
    }
  }
  http.send()

  const button = document.getElementById('btnCall')
  button.addEventListener('click', callSupport)
}

function callSupport() {
  applicationObj.callServer(SUPPORT_NUMBER)
}

function terminateCall(call) {
  currentCall.hangUp()
  btnCall.className = "button-call"
  btnCall.innerHTML = "Call Now!"
  btnCall.removeEventListener('click', terminateCall)
  btnCall.addEventListener('click', callSupport)
}

function errorLogger(error) {
  console.log(error)
}