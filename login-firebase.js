import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- 1. FIREBASE CONFIGURATION ---
// IMPORTANT: Replace the values below with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, provider;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
} catch (error) {
    console.error("Firebase Initialization Error. Did you replace the config config?", error);
}

// --- 2. DYNAMIC LOGIN BUTTON LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    injectAuthButton();
});

function injectAuthButton() {
    const navList = document.querySelector('nav ul');
    if (!navList) {
        console.warn("Navigation menu not found. Login button cannot be added.");
        return;
    }

    // Create the List Item
    const li = document.createElement('li');
    
    // Create the Button/Link
    const authBtn = document.createElement('a');
    authBtn.href = "#"; // Prevent default navigation
    authBtn.id = "auth-btn";
    authBtn.textContent = "Login"; // Default text
    authBtn.style.cursor = "pointer";
    
    // Add specific styling to make it stand out (Optional)
    // Makes it look like a button inside the nav
    authBtn.style.border = "1px solid rgba(255,255,255,0.5)";
    authBtn.style.backgroundColor = "rgba(255,255,255,0.1)";
    
    // Handle Click Event
    authBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleAuthClick();
    });

    li.appendChild(authBtn);
    navList.appendChild(li);

    // --- 3. AUTH STATE LISTENER ---
    // This updates the button whenever the user logs in or out
    if (auth) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is Logged In
                console.log("User logged in:", user.displayName);
                authBtn.textContent = `Logout (${user.displayName.split(' ')[0]})`;
                authBtn.title = "Click to Logout";
                authBtn.classList.add('user-logged-in'); // For custom CSS if needed
                
                // Optional: Update UI elsewhere if needed
                if(window.showNotification) window.showNotification(`Welcome back, ${user.displayName.split(' ')[0]}!`, 'success');
            } else {
                // User is Logged Out
                console.log("User logged out");
                authBtn.textContent = "Login";
                authBtn.title = "Login with Google";
                authBtn.classList.remove('user-logged-in');
            }
        });
    }
}

// --- 4. HANDLE CLICK ACTIONS ---

async function handleAuthClick() {
    if (!auth) {
        alert("Firebase not configured properly. Check console.");
        return;
    }

    const btn = document.getElementById('auth-btn');
    const user = auth.currentUser;

    if (user) {
        // --- LOGOUT LOGIC ---
        try {
            if(btn) btn.textContent = "Logging out...";
            await signOut(auth);
            if(window.showNotification) window.showNotification("Logged out successfully.", "info");
        } catch (error) {
            console.error("Logout Error:", error);
            if(window.showNotification) window.showNotification("Error logging out.", "error");
        }
    } else {
        // --- LOGIN LOGIC ---
        try {
            if(btn) btn.textContent = "Please wait...";
            await signInWithPopup(auth, provider);
            // onAuthStateChanged will handle the UI update after success
        } catch (error) {
            console.error("Login Error:", error);
            if(btn) btn.textContent = "Login"; // Reset text on error
            
            let msg = "Authentication failed.";
            if (error.code === 'auth/popup-closed-by-user') msg = "Login cancelled.";
            if (error.code === 'auth/configuration-not-found') msg = "Firebase config invalid.";
            
            if(window.showNotification) {
                window.showNotification(msg, "error");
            } else {
                alert(msg);
            }
        }
    }
}