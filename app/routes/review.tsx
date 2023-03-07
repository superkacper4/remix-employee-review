import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireUser } from "~/session.server";
import { reduce } from "ramda";
import { getManyQuestionById, updateQuestionById } from "~/models/question";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import type { Question } from "@prisma/client";
import { getUsersQuestionsWithoutReview } from "~/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questions = await getUsersQuestionsWithoutReview({ id: user.id });

  return json({
    questions: questions?.questions,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questionsOnUser = await getUsersQuestionsWithoutReview({ id: user.id });

  const formData = await request.formData();

  invariant(questionsOnUser, "Questions are required");

  const formValues = reduce(
    (accumulator: { id: string; value: number }[], currentValue: Question) => {
      return [
        ...accumulator,
        {
          id: currentValue.id,
          value: Number(formData.get(currentValue.id)),
        },
      ];
    },
    [],
    questionsOnUser.questions
  );

  formValues.forEach(async (value) => {
    await updateQuestionById({ questionIdAndValue: value });
  });

  console.log("fromValues: ", formValues);

  return null;
};

const ReviewPage = () => {
  const { questions } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Ankieta pracownicza</h1>
      <Form method="post">
        {questions.map((question: Question) => (
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
