import React from "react";
import type { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireUser } from "~/session.server";
import { getUsersQuestionsReview } from "~/models/question.server";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import TableComponent from "~/components/TableComponent/TableComponent";
import Wrapper from "~/components/Wrapper";
import NavBar from "~/components/NavBar/NavBar";
import H1 from "~/components/H1";

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
    <Wrapper>
      <NavBar />
      <H1>Ankieta pracownicza</H1>
      <TableComponent questions={questions} isViewOnly />
    </Wrapper>
  );
};

export default ReviewOverviewPage;
