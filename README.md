# Secure Quiz App with Webcam Monitoring

A React-based quiz application that includes webcam monitoring for proctoring purposes. The app allows users to take multiple-choice quizzes while their webcam feed is recorded for security purposes.

## Features

- Multiple-choice quiz interface
- Real-time webcam monitoring
- Score calculation and results display
- Session history storage
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with webcam support

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd secure-quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Webcam Permissions

When you start the quiz, your browser will request permission to access your webcam. You must grant this permission to take the quiz. The webcam feed will be displayed in the bottom-right corner of the screen during the quiz.

## Sample Data

The quiz includes sample questions about React.js. The data structure is as follows:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is React?",
      "options": ["Library", "Framework", "IDE", "Tool"],
      "correct": "Library"
    }
  ],
  "sessions": [
    {
      "id": 1,
      "timestamp": "2025-05-30T11:00:00Z",
      "score": 8,
      "answers": [
        {
          "qId": 1,
          "selected": "Library"
        }
      ]
    }
  ]
}
```

## Technologies Used

- React.js with TypeScript
- react-webcam for webcam integration
- Tailwind CSS for styling
- localStorage for data persistence

## Security Notes

- The webcam feed is only active during the quiz
- Quiz sessions are stored locally in the browser
- No data is sent to external servers

## License

MIT
