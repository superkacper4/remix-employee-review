import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import {
  getSubordinatesQuestionsWithReview,
  getUsersQuestionsWithoutProp,
  updateQuestionById,
} from "~/models/question.server";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import { getSubordinates } from "~/models/user.server";
import type { Question, User } from "@prisma/client";
import { reduce } from "ramda";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const subordinates = await getSubordinates({ managerId: userId });
  const subIds = subordinates.map((sub) => sub.id);

  const subordinatesQuestions = await getSubordinatesQuestionsWithReview({
    subIds,
  });

  //   invariant(questions, "Questoins are required");

  return json({
    subordinatesQuestions,
  });
};

const SubordinatesReviewPage = () => {
  const { subordinatesQuestions } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Podwładni</h1>
      {subordinatesQuestions.map((sub: User & { questions: Question[] }) => {
        return (
          <>
            {sub.questions.length > 0 && (
              <div>
                <p>{sub.email}</p>
                <p>{sub.id}</p>
                {sub.questions.map((question: Question) => (
                  <div key={question.id}>
                    <p>{question.message}</p>
                    <p>{question.review}</p>
                    <p>{question.managerReview}</p>
                    <p>{String(question.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default SubordinatesReviewPage;
