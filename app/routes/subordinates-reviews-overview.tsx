import React from "react";
import type { LoaderFunction } from "react-router";
import { requireUserId } from "~/session.server";
import { getSubordinatesQuestionsWithReview } from "~/models/question.server";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { getSubordinates } from "~/models/user.server";
import type { Question, User } from "@prisma/client";
import TableComponent from "~/components/TableComponent/TableComponent";
import Wrapper from "~/components/Wrapper";
import NavBar from "~/components/NavBar/NavBar";
import H1 from "~/components/H1";

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
    <Wrapper>
      <NavBar />
      <H1>Podwładni</H1>
      {subordinatesQuestions.length > 0 ? (
        subordinatesQuestions.map((sub: User & { questions: Question[] }) => {
          return (
            <>
              {sub.questions.length > 0 && (
                <div>
                  <p>{sub.email}</p>
                  <TableComponent
                    isViewOnly
                    subId={sub.id}
                    questions={sub.questions}
                    isManagerView
                  />
                </div>
              )}
            </>
          );
        })
      ) : (
        <p>Brak podwładnych</p>
      )}
    </Wrapper>
  );
};

export default SubordinatesReviewPage;
