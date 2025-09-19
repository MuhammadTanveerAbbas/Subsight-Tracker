<h1 align="center">Subsight 🎯</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini" />
</p>

Subsight is a modern, privacy focused subscription tracking application designed to help you manage your recurring payments effortlessly. It's built to run entirely in your browser, meaning your financial data never leaves your device. No sign ups, no databases, just a simple and powerful tool to take control of your subscriptions.

## ✨ Why Subsight?

In a world where data privacy is paramount, Subsight offers a unique approach:

- **🔒 Privacy First**: All data is stored locally in your browser's localStorage. No servers, no databases, no accounts. Your financial information is yours alone.
- **🚀 Blazing Fast**: Built with Next.js and running on the client side, the experience is instant.
- **🤖 AI-Powered**: Leverage the power of Google's Gemini AI to auto fill subscription details and get intelligent summaries of your spending habits.
- **💡 Zero Cost**: It's a completely free tool. No hidden fees, no premium tiers.

## 🌟 Key Features

- **📊 Interactive Dashboard**: Visualize your monthly and annual spending with beautiful, responsive charts.
- **🤖 AI Subscription Assistant**: Simply type the name of a service (e.g., "Netflix"), and let the AI fill in the rest of the details.
- **🧠 AI Spending Summary**: Get AI generated insights and a summary of your spending habits to identify potential savings.
- **🎭 Simulation Mode**: Toggle subscriptions on or off to see the immediate impact on your monthly and annual costs.
- **🔄 Import/Export**: Easily import your existing subscriptions from a JSON or CSV file, and export your data to JSON, CSV, or a printable PDF report.
- **📱 Fully Responsive**: A seamless experience whether you're on a desktop, tablet, or mobile phone.
- **🎨 Sleek & Modern UI**: A clean, dark themed interface built with the latest design trends.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google's Gemini Model](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and `npm` installed on your machine.

### Installation & Running

1.  Clone the repository:
    ```sh
    git clone https://github.com/MuhammadTanveerAbbas/Subsight-Tracker.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd subsight
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Create a `.env` file in the root and add your Google AI API key:

    ```
    GEMINI_API_KEY=YOUR_API_KEY
    ```

    You can get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).

5.  Run the development server:
    ```sh
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ by [Muhammad Tanveer Abbas](https://github.com/muhammadtanveerabbas)
