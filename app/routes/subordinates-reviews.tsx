import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import {
  getSubordinatesQuestionsWithoutReview,
  getUsersQuestionsWithoutProp,
  updateQuestionById,
} from "~/models/question.server";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import { calculateBonus, getSubordinates } from "~/models/user.server";
import type { Question, User } from "@prisma/client";
import { reduce } from "ramda";
import TableComponent from "~/components/TableComponent/TableComponent";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const subordinates = await getSubordinates({ managerId: userId });
  const subIds = subordinates.map((sub) => sub.id);

  const subordinatesQuestions = await getSubordinatesQuestionsWithoutReview({
    subIds,
  });

  return json({
    subordinatesQuestions,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const subId = formData.get("subId");

  const questionsOnSubordinate = await getUsersQuestionsWithoutProp({
    id: String(subId),
    prop: "managerReview",
  });

  invariant(questionsOnSubordinate, "Questions are required");

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
    questionsOnSubordinate.questions
  );

  formValues.forEach(async (value) => {
    await updateQuestionById({
      questionIdAndValue: value,
      prop: "managerReview",
    });
  });

  await calculateBonus({ userId: String(subId) });

  return null;
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
              <Form method="post" key={sub.id}>
                <p>{sub.email}</p>
                <TableComponent
                  subId={sub.id}
                  questions={sub.questions}
                  isManagerView
                />

                <button type="submit">Zatwierdź dla {sub.email}</button>
              </Form>
            )}
          </>
        );
      })}
    </div>
  );
};

export default SubordinatesReviewPage;
