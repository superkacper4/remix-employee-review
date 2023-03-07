import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireUser } from "~/session.server";
import { reduce } from "ramda";
import {
  getManyQuestionById,
  updateQuestionById,
} from "~/models/question.server";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import type { Question } from "@prisma/client";
import { getUsersQuestionsReview } from "~/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questions = await getUsersQuestionsReview({ id: user.id });

  invariant(questions, "Questoins are required");

  return json({
    questions: questions.questions,
  });
};

const ReviewPage = () => {
  const { questions } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Ankieta pracownicza</h1>
      {questions.map((question: Question) => (
        <div key={question.id}>
          <p>{question.message}</p>
          <p>{question.review}</p>
          <p>{String(question.createdAt)}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewPage;
