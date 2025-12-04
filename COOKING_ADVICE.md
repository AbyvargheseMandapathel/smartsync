# Smart Cooking Advice & Order Management

## Purpose
The **Smart Cooking Advice** feature is designed to optimize kitchen operations and ensure food freshness. By analyzing real-time factors such as delivery partner location, traffic conditions (simulated), and preparation time, the system advises restaurants on the *exact* best time to start cooking. This prevents food from sitting cold while waiting for a driver and ensures it is hot and fresh upon pickup.

## Functionality

### 1. AI-Powered Analysis (Gemini Integration)
*   **Trigger**: When a new order is placed.
*   **Process**: The system sends order details (items, prep time) and location data to Google's Gemini AI.
*   **Analysis**: Gemini calculates the optimal start time based on the estimated arrival of the delivery partner.
*   **Output**: A precise recommendation, e.g., "Start cooking in 10 minutes."

### 2. Intelligent Order Clubbing
*   **Efficiency**: To avoid redundant API calls and enable batch cooking, the system checks for existing active orders.
*   **Syncing**: If a new order contains items that match an order already waiting to start, the new order is automatically "clubbed" with the existing one.
*   **Result**: The timers are synced, allowing the kitchen to prepare multiple orders of the same item simultaneously.

### 3. Live UI Countdown
*   **Visualization**: The "Status" column in the Restaurant Dashboard is enhanced with a live countdown timer.
*   **Feedback**: Chefs can see exactly how many minutes/seconds remain before they need to fire the order.

## Outcome

### Dashboard View
The dashboard provides a clear, real-time view of all orders. The status highlights when to start cooking, accompanied by a dynamic countdown.

![Dashboard with Countdown](C:/Users/ww/.gemini/antigravity/brain/bb545eda-8399-4689-a774-9f0783c33321/uploaded_image_0_1764866407913.png)

### Detailed Advice
Clicking "Get Cooking Advice" (or viewing the automatic status) reveals the reasoning behind the recommendation, giving chefs confidence in the system's timing.

![Cooking Advice Modal](C:/Users/ww/.gemini/antigravity/brain/bb545eda-8399-4689-a774-9f0783c33321/uploaded_image_1_1764866407913.png)
