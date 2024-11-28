# SpiceSwap - Recipe Sharing Web Application
[Live Preview](https://spiceswap.nikolay-dimitrov.xyz/)

## Overview
SpiceSwap is a dynamic, community-driven recipe-sharing web application where users can share their favorite recipes and browse others' recipes. Built using Angular and TypeScript with Firebase as the backend, SpiceSwap offers a seamless experience for food enthusiasts to connect and discover new recipes.

## Features

- **User Authentication:** Secure login and registration via Firebase Authentication for users.
- **Recipe Sharing:** Users can post their recipes with images and ingredient details, as well as preparation instructions.
- **Filters:** Advanced filter options for users to find recipes based on difficulty and recency.
- **Responsive Design:** The app is fully responsive, ensuring it works seamlessly across mobile, tablet, and desktop devices.
- **Cloud Storage:** Images and media assets are stored in Firebase Storage, ensuring fast and secure access.
- **Real-time Data Sync:** Leveraging Firebase Firestore for real-time data syncing and instant updates.

## Tech Stack

- **Angular:** Angular framework for building a fast, scalable, and maintainable frontend.
- **TypeScript:** Typed JavaScript for improved development experience and code quality.
- **Firebase:** Backend services powered by Firebase, including Firebase Authentication for secure user login, Firestore for real-time database capabilities, and Firebase Storage for cloud-based image storage.
- **Firebase Hosting:** Fast and secure hosting for the web application.

## How to Run the Application Locally
1. **Clone the repository:**
   
   ```bash
   git clone https://github.com/nikolayy-dimitrov/SpiceSwap.git
   cd SpiceSwap
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
   
3. **Set up Firebase Configuration:**
   ### Create a Firebase project at Firebase Console.
   ### Obtain your Firebase configuration (API keys, etc.) and update the src/environments/environment.ts file.

4. **Run the application:**
  
  ```bash
  ng serve
  ```

5. **Open your browser and go to [http://localhost:4200](http://localhost:4200) to view the application.**

## Architecture
**The architecture of SpiceSwap is based on a client-server model. The client-side is built using Angular and communicates with Firebase services for user authentication, data storage, and real-time updates.**

### Frontend (Angular):
- Components handle user interface (UI) logic.
- Services are used to interact with Firebase for CRUD operations (creating, reading, updating, and deleting data).
- Firebase Authentication is integrated for secure login and registration.

### Backend (Firebase):
- Firebase Authentication: Manages user authentication and user session states.
- Firestore: A NoSQL cloud database that stores recipes, user information, and comments.
- Firebase Storage: Used for storing and serving images associated with recipes.
- Firebase Hosting: Serves the web app from Firebase's fast and secure hosting platform.

## Screenshots
### Home Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/8fa9f16e-e254-40cb-8e96-f79c80154442">

### Dashboard
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/bcfaccd1-7aa0-4b20-a69a-7ad03ffee51c">

### Add a Recipe Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/897c096b-1122-416c-9487-7b87a6834877">
