import { Question  } from './question'
import { createModal, isValid } from './utils'
import { authWithEmailAndPassword, getAuthForm } from './auth.js'
import './style.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = document.querySelector('#question-input')
const submitBtn = document.querySelector('#submit')


window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true
        // Async request to server, to save question
        Question.create(question).then( () => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm())
    document.getElementById('auth-form')
    .addEventListener('submit', authFromHandler, {once: true})
}

function authFromHandler(event) {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true
    authWithEmailAndPassword(email, password)
        // 2 способа как это сделать
        // 1.
        .then(Question.fetch())
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
        // 2.
        // .then(token => {
        //     return Question.fetch(token)
        // })
}

function renderModalAfterAuth(content) {
    if(typeof content === 'string') {
        createModal('Ошибка!', content)
    } else {
        createModal('Ваш список вопросов ;)', Question.listToHTML(content))
    }
}


// вышли ошибки 
// authWithEmailAndPassword @ auth.js:28
// authFromHandler @ app.js:57
// question.js:54 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'length')
//     at Question.listToHTML (question.js:54:26)
//     at renderModalAfterAuth (app.js:73:135)

// остановился на 1:44:16