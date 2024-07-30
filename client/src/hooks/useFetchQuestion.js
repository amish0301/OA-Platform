import { useEffect, useState } from "react";
import { questions } from "../constants/quiz";
import { useDispatch } from "react-redux";
import { setQuestions } from "../redux/slices/questionSlice";

export const useFetchQuestion = () => {
  const [getData, setData] = useState({
    isLoading: false,
    data: [],
    isError: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => ({ ...prev, isLoading: true }));

    // api call
    // url template - {serverURI}/test/id/questions/{questionNo}

    (async () => {
      try {
        const question = await questions;

        if (question.length > 0) {
          setData((prev) => ({ ...prev, data: question, isLoading: false }));

          // dispatch actions
          dispatch(setQuestions(question));
        } else {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            isError: "No questions found",
          }));
        }
      } catch (error) {
        setData((prev) => ({ ...prev, isError: error, isLoading: false }));
      }
    })();
  }, [dispatch]);

  return getData;
};
