import { Form, Link } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { generateStandardQuestion } from "~/models/question.server";
import { requireUserId } from "~/session.server";

import { useOptionalUser } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  await generateStandardQuestion({ userId: String(userId) });

  return redirect("/review");
};

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      {user ? (
        <>
          <Form method="post">
            <button type="submit" name="generateQuestions">
              Wygeneruj pytania
            </button>
          </Form>
          <Link
            to="/review"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
          >
            Wypełnij ankiete
          </Link>
          <Link
            to="/review-overview"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
          >
            Pokaz poprzednie anikety {user.email}
          </Link>
        </>
      ) : (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          <Link
            to="/join"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
          >
            Log In
          </Link>
        </div>
      )}
    </main>
  );
}
