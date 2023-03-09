import React from "react";
import type { LoaderFunction } from "react-router";
import { requireUserId } from "~/session.server";
import { getSubordinatesQuestionsWithReview } from "~/models/question.server";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { getSubordinates } from "~/models/user.server";
import type { Question, User } from "@prisma/client";
import Table from "~/components/Table/Table";

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
                <Table
                  isViewOnly
                  subId={sub.id}
                  questions={sub.questions}
                  isManagerView
                />
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default SubordinatesReviewPage;
