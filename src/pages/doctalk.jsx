import React, { useState } from 'react';

const QAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState({});

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { id: questions.length + 1, content: newQuestion, answers: [] }]);
      setNewQuestion("");
    }
  };

  const addAnswer = (questionId) => {
    const answer = newAnswers[questionId];
    if (answer && answer.trim()) {
      setQuestions(questions.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q
      ));
      setNewAnswers({ ...newAnswers, [questionId]: "" });
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setNewAnswers({ ...newAnswers, [questionId]: value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Ask a Question</h1>
      <div className="mb-6">
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Type your question here..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button onClick={addQuestion} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Submit Question
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Questions & Answers</h2>
      {questions.length === 0 ? (
        <p>No questions yet. Be the first to ask!</p>
      ) : (
        questions.map((question) => (
          <div key={question.id} className="mb-6">
            <h3 className="font-bold">{question.content}</h3>
            <ul className="ml-4 mt-2">
              {question.answers.map((answer, index) => (
                <li key={index} className="list-disc">{answer}</li>
              ))}
            </ul>
            <input
              type="text"
              className="border p-2 w-full rounded mt-2"
              placeholder="Type your answer..."
              value={newAnswers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
            <button onClick={() => addAnswer(question.id)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
              Submit Answer
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default QAPage;