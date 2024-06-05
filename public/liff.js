import Dexie from 'dexie';

// Initialize Dexie database
const db = new Dexie('LiffAppDatabase');
db.version(1).stores({
  users: '++id,uid,displayname,profileurl,date,subscription'
});

// Initialize the LIFF app
function initializeLiff() {
  liff.init({ liffId: 'YOUR_LIFF_ID' })
    .then(() => {
      document.getElementById('loginButton').addEventListener('click', () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          handleProfile();
        }
      });
    })
    .catch((err) => {
      console.error('LIFF Initialization failed', err);
    });
}

// Handle profile and redirection
function handleProfile() {
  liff.getProfile()
    .then(profile => {
      checkRegistration(profile);
    })
    .catch(err => {
      console.error('Failed to get profile', err);
    });
}

// Check if the user is registered
function checkRegistration(profile) {
  db.users.where({ uid: profile.userId }).count(count => {
    if (count > 0) {
      // Redirect to dashboard if registered
      window.location.href = `/dashboard/${profile.userId}`;
    } else {
      // Register user and redirect to registration page if not registered
      storeUserProfile(profile);
      window.location.href = '/register';
    }
  });
}

// Store user profile in Dexie database
function storeUserProfile(profile) {
  const user = {
    uid: profile.userId,
    displayname: profile.displayName,
    profileurl: profile.pictureUrl,
    date: new Date().toISOString(),
    subscription: false // Set default subscription status
  };
  addUser(user);
}

// Function to add user to Dexie database
function addUser(user) {
  db.users.add(user).then(() => {
    console.log('User added:', user);
  }).catch((err) => {
    console.error('Failed to add user:', err);
  });
}

// Call initializeLiff on page load
initializeLiff();
