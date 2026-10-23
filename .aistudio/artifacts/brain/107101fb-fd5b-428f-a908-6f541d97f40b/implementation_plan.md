# Firebase Console Navigation & Control Guide for BIG BOSS WATCHES

This plan outlines the direct links and navigation pathways to control your backend resources, live database records, authentication, and security rules in Google Firebase.

---

## 1. Project Identifiers

- **Firebase Project ID:** `triple-seer-ncbh2`
- **Cloud Firestore Database ID:** `ai-studio-107101fb-fd5b-428f-a908-6f541d97f40b`
- **Primary Admin Google Account:** `humayunjan57@gmail.com`
- **Storage Bucket:** `triple-seer-ncbh2.firebasestorage.app`

---

## 2. Direct Firebase Console Links

### A. Cloud Firestore (Database Records)
To view, create, edit, or delete live watches, orders, inquiries, carts, and boutique settings:
- **Direct Database Link:**  
  [Open Cloud Firestore Data Console](https://console.firebase.google.com/project/triple-seer-ncbh2/firestore/databases/ai-studio-107101fb-fd5b-428f-a908-6f541d97f40b/data)

**Collections available to control:**
1. `products` — Real timepiece models, prices, sale prices, stock quantities, and horology specifications.
2. `orders` — Customer orders, transaction statuses, delivery addresses, and payment modes.
3. `contactMessages` — Customer support inquiries, messages, status flags, and response history.
4. `settings` (`store` doc) — Official WhatsApp numbers (`03098962803`, `0345 0434786`), support email, and store policies.
5. `users` — Registered client accounts and saved delivery coordinates.
6. `collections` — `big-boss-noir` and `big-boss-royal` collection metadata.

---

### B. Firebase Authentication (User Management)
To view registered customers, reset passwords, disable users, or inspect sign-in providers:
- **Direct Auth Link:**  
  [Open Firebase Authentication Console](https://console.firebase.google.com/project/triple-seer-ncbh2/authentication/users)

---

### C. Firestore Security Rules
To review or edit the active access control rules:
- **Direct Rules Link:**  
  [Open Firestore Security Rules](https://console.firebase.google.com/project/triple-seer-ncbh2/firestore/databases/ai-studio-107101fb-fd5b-428f-a908-6f541d97f40b/rules)

---

### D. Firebase Project Overview
To view general project settings, usage quotas, and connected web apps:
- **Direct Project Link:**  
  [Open Firebase Project Overview](https://console.firebase.google.com/project/triple-seer-ncbh2/overview)

---

## 3. Step-by-Step Instructions

1. Make sure you are logged into Google with **`humayunjan57@gmail.com`** in your browser.
2. Click the **Direct Database Link** above or visit [https://console.firebase.google.com](https://console.firebase.google.com).
3. Select the project **`triple-seer-ncbh2`**.
4. In the left navigation menu, click **Build** > **Firestore Database**.
5. In the database dropdown at the top, select database **`ai-studio-107101fb-fd5b-428f-a908-6f541d97f40b`** (if not automatically opened).
6. Click on any collection (`products`, `orders`, `contactMessages`, `settings`) to add, modify, or inspect records directly.
