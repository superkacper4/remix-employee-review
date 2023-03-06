import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { getQuestionsOnUser } from "~/models/questionsOnUsers";
import { requireUser } from "~/session.server";
import { reduce } from "ramda";
import {
  getManyQuestionById,
  getQuestionById,
  updateQuestionById,
} from "~/models/question";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import type { Question } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questionsOnUser = await getQuestionsOnUser({ userId: user.id });
  const arrayOfQuestionIds = questionsOnUser.map(
    (question) => question.questionId
  );

  const arrayOfQuestion = await getManyQuestionById({
    questionIds: arrayOfQuestionIds,
  });

  return json({
    arrayOfQuestion,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questionsOnUser = await getQuestionsOnUser({ userId: user.id });
  const arrayOfQuestionIds = questionsOnUser.map(
    (question) => question.questionId
  );

  const formData = await request.formData();

  const formValues = reduce(
    (accumulator, currentValue) => {
      return [
        ...accumulator,
        {
          id: currentValue,
          value: Number(formData.get(currentValue)),
        },
      ];
    },
    [],
    arrayOfQuestionIds
  );
  const x = Object.entries(formValues);

  formValues.forEach(async (value) => {
    await updateQuestionById({ questionIdAndValue: value });
  });

  console.log(x[0][0], formValues);

  return null;
};

const ReviewPage = () => {
  const { arrayOfQuestion } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Ankieta pracownicza</h1>
      <Form method="post">
        {arrayOfQuestion.map((question: Question) => (
          <div key={question.id}>
            <p>{question.message}</p>
            <p>{question.review}</p>
            <input type="number" name={question.id} />
          </div>
        ))}
        <button type="submit">Zatwierdź</button>
      </Form>
    </div>
  );
};

export default ReviewPage;
