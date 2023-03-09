import type { Question } from "@prisma/client";
import React from "react";
import Td from "../Td";
import Th from "../Th";

const ManagerReviewPanel = ({
  isManagerView,
  isViewOnly,
  question,
  subId,
}: {
  isManagerView?: boolean;
  question: Question;
  isViewOnly?: boolean;
  subId?: string;
}) => {
  return (
    <>
      {isManagerView ? (
        <>
          <Td>{question.review}</Td>
          {!isViewOnly ? (
            <>
              <Td>
                <input type="number" name={question.id} />
              </Td>
              {subId && <input type="hidden" name="subId" value={subId} />}
            </>
          ) : (
            <Td>{question.managerReview}</Td>
          )}
        </>
      ) : (
        <>
          {!isViewOnly ? (
            <>
              <Td>
                <input type="number" name={question.id} />
              </Td>
            </>
          ) : (
            <Td>{question.review}</Td>
          )}
          <Td>{question.managerReview}</Td>
        </>
      )}
    </>
  );
};

const Table = ({
  children,
  subId,
  isViewOnly,
  questions,
  isManagerView,
}: {
  children?: React.ReactNode;
  subId?: string;
  questions: Question[];
  isViewOnly?: boolean;
  isManagerView?: boolean;
}) => {
  return (
    <table
      style={{
        border: "1px solid black",
      }}
    >
      <Th>Data</Th>
      <Th>Pytanie</Th>
      <Th>Opinia pracownika</Th>
      <Th>Opinia kierownika</Th>
      {questions.map((question: Question) => (
        <tr key={question.id}>
          <Td>{String(question.createdAt).slice(0, 10)}</Td>
          <Td>{question.message}</Td>
          {/* <Td>{question.review}</Td>
          {!isViewOnly ? (
            <>
              <Td>
                <input type="number" name={question.id} />
              </Td>
              {subId && <input type="hidden" name="subId" value={subId} />}
            </>
          ) : (
            <Td>{question.managerReview}</Td>
          )} */}
          <ManagerReviewPanel
            isManagerView={isManagerView}
            isViewOnly={isViewOnly}
            question={question}
            subId={subId}
          />
        </tr>
      ))}
    </table>
  );
};

export default Table;
