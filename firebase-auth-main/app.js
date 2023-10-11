import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import { getFirestore, collection, addDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'

 const firebaseConfig = {
    apiKey: 'AIzaSyB9iuoeNcfq0merJSkq0DW2viYiMjqpxPs',
    authDomain: 'fir-auth-42996.firebaseapp.com',
    projectId: 'fir-auth-42996',
    storageBucket: 'fir-auth-42996.appspot.com',
    messagingSenderId: '236585773180',
    appId: '1:236585773180:web:06844018472aa8585b41f9',
    measurementId: 'G-MCS0JJF7KR'
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  const db = getFirestore(app)
  const collectionPhrases = collection(db, 'phrases')


  const buttonGoogle = document.querySelector('[data-js="button-google"]')
  const linkLogout = document.querySelector('[data-js="logout"]')
  const phrasesList = document.querySelector('[data-js="phrases-list"]')

  const addPhrase = async e => {
   e.preventDefault()

   try {
      const addedDoc = await addDoc(collectionPhrases, {
         movieTitle: DOMPurify.sanitize(e.target.title.value),
         phrase: DOMPurify.sanitize(e.target.phrase.value)
      })

      console.log('Document adicionado com o ID:', addedDoc.id)
      e.target.reset()

      const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
      M.Modal.getInstance(modalAddPhrase).close()

   } catch (error) {
      console.log('Problema na adição do document:', error)
   }
}

 const handleAuthStateChanged = user => {
   const lis = [...document.querySelector('[data-js="nav-ul"]').children]

   lis.forEach(li => {
       const liShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')

       if(liShouldBeVisible) {
           li.classList.remove('hide')
           return
       }

       li.classList.add('hide')
   })

   console.log(user)
   const loginMessageExists = document.querySelector('[data-js="login-message"]')

      loginMessageExists?.remove()

   const formAddPhrase = document.querySelector('[data-js="add-phrase-form"]')

   if (!user) {
      const phrasesContainer = document.querySelector('[data-js="phrases-container"]')
      const loginMessage = document.createElement('h5')

      loginMessage.textContent = 'Faça login para ver as frases'
      loginMessage.classList.add('center-align', 'white-text')
      loginMessage.setAttribute('data-js', 'login-message')
      phrasesContainer.append(loginMessage)

      formAddPhrase.removeEventListener('submit', addPhrase)
      return
  }

  formAddPhrase.addEventListener('submit', addPhrase)
  onSnapshot(collectionPhrases, snapshot => {
   const documentFragment = document.createDocumentFragment()


   snapshot.docChanges().forEach(docChange => {
      const liPhrase = document.createElement('li')
      const movieTitleContainer = document.createElement('div')
      const phraseContainer = document.createElement('div')
      const { movieTitle, phrase } = docChange.doc.data()

      movieTitleContainer.textContent = DOMPurify.sanitize(movieTitle)
      phraseContainer.textContent = DOMPurify.sanitize(phrase)
      movieTitleContainer.setAttribute('class', 'collapsible-header blue-grey-text text-lighten-5 blue-grey darken-4')
      phraseContainer.setAttribute('class', 'collapsible-body blue-grey-text text-lighten-5 blue-grey darken-3')

      liPhrase.append(movieTitleContainer, phraseContainer)
      documentFragment.append(liPhrase)

   })

   phrasesList.append('documentFragment:', documentFragment)
  })

 }

 const initModals = () => {
    const modals = document.querySelectorAll('[data-js="modal"]')
    M.Modal.init(modals)
  }

  const login = async () => {
    try {
       await signInWithPopup(auth, provider)

       const modalLogin = document.querySelector('[data-modal="login"]')
       M.Modal.getInstance(modalLogin).close()

    } catch (error){
        console.log('error:', error)
    }
 }

 const logout = async () => {
    try {
       await signOut(auth)
       console.log('Usuário foi deslogado')
    } catch (error) {
        console.log('error:', error)
    }
 }

 onAuthStateChanged(auth, handleAuthStateChanged)
 buttonGoogle.addEventListener('click', login)
 linkLogout.addEventListener('click', logout)

 initModals()