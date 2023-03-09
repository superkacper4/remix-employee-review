import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireUser } from "~/session.server";
import { getUsersQuestionsReview } from "~/models/question.server";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import TableComponent from "~/components/TableComponent/TableComponent";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const questions = await getUsersQuestionsReview({ id: user.id });

  invariant(questions, "Questoins are required");

  return json({
    questions: questions.questions,
  });
};

const ReviewOverviewPage = () => {
  const { questions } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Ankieta pracownicza</h1>
      <TableComponent questions={questions} isViewOnly />
    </div>
  );
};

export default ReviewOverviewPage;
