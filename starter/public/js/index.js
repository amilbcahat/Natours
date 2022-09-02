/* eslint-disable */

// console.log('Hello from parcel');
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');

const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
// console.log(bookBtn);

//DELEGATION
if (mapBox) {
  console.log(mapBox.dataset);
  console.log(mapBox);
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // console.log('button clicked');
    login(email, password);
  });
}

if (signupForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // console.log('button clicked');
    signup(name, email, password, passwordConfirm);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-settings').textContent = 'Updating...';

    // console.log('button was recognised 2');
    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);
    // const email = document.getElementById('email').value;
    await updateSettings(form, 'data');
    document.querySelector('.btn--save-settings').textContent = 'Save Settings';
    location.reload();
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    // console.log('button was recognised 2');

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    // const email = document.getElementById('email').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // console.log('button clicked 3');
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (logOutBtn) {
  // console.log('button was recognised 1');
  logOutBtn.addEventListener('click', logout);
}

const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) {
  showAlert('success', alertMessage, 20);
}
