# React Application

## How to Run the Project

### 1. Install Dependencies

Make sure you have Node.js and npm installed on your machine. To install all the project dependencies, run:

```bash
npm install
```

### 2. Run the Application Locally

To start the application in development mode:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build the Application

Before deploying to Firebase, you need to build the project. This will create an optimized production version of the app in the `build` folder:

```bash
npm run build
```

### 4. Install Firebase CLI

If you haven't installed Firebase CLI yet, you need to install it globally on your machine:

```bash
npm install -g firebase-tools
```

### 5. Log in to Firebase

To deploy the app, log in to your Firebase account:

```bash
firebase login
```

### 6. Initialize Firebase (Only for First Time)

If this is your first time deploying the app to Firebase, you need to initialize Firebase in your project:

```bash
firebase init
```

During the setup, select **Hosting**, choose an existing Firebase project or create a new one, and specify the `build` directory as the public directory.

### 7. Deploy to Firebase

Once the project is built, deploy it to Firebase Hosting by running:

```bash
firebase deploy
```

After a successful deployment, you'll receive a URL where your app is hosted, like:

```
Hosting URL: https://adminpanel-99703.web.app

```

You can now access your app using the provided URL.
```

Это файл с разметкой Markdown, который вы можете использовать в своем проекте. Просто скопируйте этот текст в файл с именем `README.md`.
https://adminpanel-99703.web.app


admin panel - repo
