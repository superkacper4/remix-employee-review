import type { Question } from "@prisma/client";
import React from "react";
import Td from "../Td";
import { Table, TableBody, TableHead, TableRow } from "@mui/material";

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

const TableComponent = ({
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
    <Table>
      <TableHead>
        <TableRow>
          <Td>Data</Td>
          <Td>Pytanie</Td>
          <Td>Opinia pracownika</Td>
          <Td>Opinia kierownika</Td>
          <Td>Procnet premii</Td>
        </TableRow>
      </TableHead>
      <TableBody>
        {questions.map((question: Question) => (
          <TableRow key={question.id} hover>
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
            <Td>
              <span
                className={`${
                  question.managerReview >= question.managerReviewThresshold
                    ? "text-lime-500"
                    : "text-orange-600"
                }`}
              >
                {question.bonusPercentValue} %
              </span>
            </Td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
