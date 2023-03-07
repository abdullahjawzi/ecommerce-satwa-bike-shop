import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBfnkQNYLN97k7sn9VVLlBgFaJ1sRYKk3M",
    authDomain: "bikepos-888d0.firebaseapp.com",
    projectId: "bikepos-888d0",
    storageBucket: "bikepos-888d0.appspot.com",
    messagingSenderId: "301798932539",
    appId: "1:301798932539:web:5d96c248ccb644f8ee9c1e"
};



const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);