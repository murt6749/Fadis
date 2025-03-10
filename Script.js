import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFgxSMtktsqJjcJOMnkTB8yZF6T492gpA",
  authDomain: "fadis-youth.firebaseapp.com",
  projectId: "fadis-youth",
  storageBucket: "fadis-youth.firebasestorage.app",
  messagingSenderId: "1067077305340",
  appId: "1:1067077305340:web:3ca9c71202a8020c6ba879",
  measurementId: "G-Z02SPW9ZKW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize reCAPTCHA (invisible)
function initRecaptcha() {
  return new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: (response) => {}
  }, auth);
}

// Utility function to display messages
function showMessage(formType, message, isError = true) {
  const messageElement = document.getElementById(formType === 'login' ? 'loginMessage' : 'signupMessage');
  messageElement.style.color = isError ? 'red' : 'green';
  messageElement.textContent = message;
  setTimeout(() => { messageElement.textContent = ''; }, 5000);
}

// Expose form-switching globally (for inline onclick)
window.switchForm = function(formType) {
  if (window.innerWidth < 480) {
    if (formType === 'signup') {
      document.querySelector('.signup-form').classList.add('active');
      document.querySelector('.login-form').classList.remove('active');
    } else {
      document.querySelector('.login-form').classList.add('active');
      document.querySelector('.signup-form').classList.remove('active');
    }
  } else {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.transform = formType === 'signup' ? 'translateX(-50%)' : 'translateX(0)';
  }
};

// Toggle Phone Authentication containers
document.getElementById('toggleLoginPhone').addEventListener('click', () => {
  const container = document.getElementById('loginPhoneContainer');
  container.style.display = container.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('toggleSignupPhone').addEventListener('click', () => {
  const container = document.getElementById('signupPhoneContainer');
  container.style.display = container.style.display === 'block' ? 'none' : 'block';
});

// ----- Email/Password Login -----
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input[placeholder="Email"]').value;
  const password = e.target.querySelector('input[placeholder="Password"]').value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('login', 'Login successful!', false);
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    })
    .catch((error) => {
      showMessage('login', error.message);
    });
});

// ----- Email/Password Signup -----
document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fullName = e.target.querySelector('input[placeholder="Full Name"]').value;
  const email = e.target.querySelector('input[placeholder="Email"]').value;
  const password = e.target.querySelector('input[placeholder="Password"]').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(userCredential.user, { displayName: fullName });
      showMessage('signup', 'Signup successful! Redirecting to login...', false);
      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    })
    .catch((error) => {
      showMessage('signup', error.message);
    });
});

// ----- Google Sign-In -----
document.querySelectorAll('.social-btn.google').forEach(btn => {
  btn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        showMessage('login', 'Google sign-in successful!', false);
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
      })
      .catch((error) => {
        showMessage('login', error.message);
      });
  });
});

// ----- Phone Authentication (Login) -----
document.getElementById('phoneLoginBtn').addEventListener('click', () => {
  const phoneNumber = document.getElementById('loginPhoneNumber').value;
  if (!phoneNumber) return showMessage('login', "Please enter your phone number with country code.");
  const recaptchaVerifier = initRecaptcha();
  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    .then((confirmationResult) => {
      const code = prompt('Enter the OTP sent to your phone:');
      return confirmationResult.confirm(code);
    })
    .then((result) => {
      showMessage('login', 'Phone login successful!', false);
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    })
    .catch((error) => {
      showMessage('login', error.message);
    });
});

// ----- Phone Authentication (Signup) -----
document.getElementById('phoneSignUpBtn').addEventListener('click', () => {
  const phoneNumber = document.getElementById('signupPhoneNumber').value;
  if (!phoneNumber) return showMessage('signup', "Please enter your phone number with country code.");
  const recaptchaVerifier = initRecaptcha();
  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    .then((confirmationResult) => {
      const code = prompt('Enter the OTP sent to your phone:');
      return confirmationResult.confirm(code);
    })
    .then((result) => {
      showMessage('signup', 'Phone signup successful! Redirecting to login...', false);
      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    })
    .catch((error) => {
      showMessage('signup', error.message);
    });
});

// ----- Placeholder for Facebook and Microsoft Sign-In -----
document.querySelectorAll('.social-btn.facebook').forEach(btn => {
  btn.addEventListener('click', () => {
    showMessage('login', 'Facebook sign-in is not implemented yet.');
  });
});
document.querySelectorAll('.social-btn.microsoft').forEach(btn => {
  btn.addEventListener('click', () => {
    showMessage('login', 'Microsoft sign-in is not implemented yet.');
  });
});
