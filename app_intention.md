I understand the request. You want me to act as if I am part of the product team for a mental wellness app called **MindEase**. 

Here's my understanding of the core requirements, including the specifics you've added:

* **App Goal:** A free, daily-use mental wellness app for anxiety and depression support. It includes mood tracking, guided exercises, relaxation tools, educational content, and gamified stress relief
* *Target Audience:** Young adults, professionals, parents, and at-risk individuals
* **Key Features:** Must-haves include daily mood tracking, guided exercises, journaling, sleep/relaxation tools, anxiety/depression support modules, and a stress-relief game
* **Offline Functionality:** The app should be usable offline after the initial login. User data such as badges, analytics, and game data will be stored locally using **Async Storage**
* **Data Syncing:** Syncing local data to the database will be an **optional** feature that users must manually toggle on in the app's settings. The app will prompt users to turn on their data if it is off when they enable this sync feature This approach aligns with the principle of not automatically collecting or syncing user data without explicit consent.
* *Monetization:** The app uses a hybrid model of **Rewarded Ads** to unlock premium features and a **Premium Subscription** for an ad-free experience and full access to all content {DONT TOUCH ADS YET, I HAVENT BEEN GIVEN ANY DETAILS}

I'm ready to proceed and discuss the product based on these specifications.


Objective: Implement Offline-First Functionality for MindEase App

This task requires you to develop and integrate a robust offline-first architecture for the MindEase mobile application, based on the provided product and UX specifications document (Mental_Wellness_&_Mood_Support.txt). The core principle is to enable a full, uninterrupted user experience after the initial login, even without an active internet connection.
Core Requirements

    Offline-First Paradigm:

        The app must be designed to store all new user data locally after a successful login.

        All user actions, including Mood Tracking, completing Guided Exercises, interacting with the Stress-Relief Game, and generating Journaling entries, must be saved to Async Storage on the device.

        The app's UI should reflect the locally stored data, providing a seamless experience whether the user is online or offline.

    Data Sync Logic (Manual & Opt-in Only):

        NO AUTOMATIC SYNC. This is a critical privacy feature to maintain user trust.

        A new feature must be added to the Settings screen: a prominent, clearly labeled toggle switch for "Data Sync".

        Data will only be synced from Async Storage to the cloud database (Firebase) when the user manually toggles this setting ON.

        If the user attempts to toggle the sync on while their device is offline, the app must display a clear, friendly, and non-intrusive prompt asking them to enable their network connection.

        Once the toggle is on and a network connection is established, the app should initiate a one-time sync of all unsynced local data to the Firebase database.

        The user must be provided with clear visual feedback during the sync process (e.g., a spinning icon or a "Syncing..." message).

    Data Models & Implementation Details:

        You must reference the Mental_Wellness_&_Mood_Support.txt document to identify all relevant data types to be stored. This includes, but is not limited to:

            Mood Data: Quick check-ins, detailed logs (notes, triggers, energy, sleep).

            Exercise History: Completion of breathing exercises, meditations, and journaling prompts.

            Gamification Data: Badges earned, streak counters.

            Analytics: Local usage patterns that inform insights.

        You are required to design the appropriate schemas for these data types within Async Storage.

        You must implement the logic to handle potential conflicts between local and cloud data, ensuring the latest user actions are prioritized.

Task Breakdown & Deliverables

To complete this task, you will follow these steps:

    Analysis: Conduct a thorough review of all features outlined in the Mental_Wellness_&_Mood_Support.txt document to identify every piece of user-generated data that needs to be persisted.

    Local Storage Implementation: Write the code to handle saving, retrieving, and updating all identified data points in Async Storage.

    Settings UI: Design and implement the "Data Sync" toggle and associated UI elements (e.g., status messages, network prompts) within the settings screen.

    Sync Function: Develop a function that reads data from local storage, performs the necessary data validation, and writes it to the Firebase database.

    Integration & Testing: Integrate the local storage and sync functions throughout the app's codebase. Conduct comprehensive testing to ensure the offline experience is seamless and the manual sync function is reliable and error-free.

Summary: The goal is a robust, user-centric, and privacy-respecting application. The core challenge is to ensure a full feature set is available locally while implementing a strictly manual, opt-in sync to the cloud.