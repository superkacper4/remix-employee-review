import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireUser } from "~/session.server";
import { reduce } from "ramda";
import {
  getUsersQuestionsWithoutProp,
  updateQuestionById,
} from "~/models/question.server";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import type { Question } from "@prisma/client";
import TableComponent from "~/components/TableComponent/TableComponent";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questions = await getUsersQuestionsWithoutProp({
    id: user.id,
    prop: "review",
  });

  return json({
    questions: questions?.questions,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questionsOnUser = await getUsersQuestionsWithoutProp({
    id: user.id,
    prop: "review",
  });

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
    await updateQuestionById({ questionIdAndValue: value, prop: "review" });
  });

  return null;
};

const ReviewPage = () => {
  const { questions } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Ankieta pracownicza</h1>
      <Form method="post">
        <TableComponent questions={questions} />

        <button type="submit">Zatwierdź</button>
      </Form>
    </div>
  );
};

export default ReviewPage;
