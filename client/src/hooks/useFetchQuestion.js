import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../hooks/useAxios";
import { setAnswers, setQuestions } from "../redux/slices/questionSlice";

export const useFetchQuestion = ({ testId }) => {
  const [getData, setData] = useState({
    isLoading: false,
    data: [],
    isError: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => ({ ...prev, isLoading: true }));

    (async () => {
      try {
        const res = await axiosInstance.get(`/test/${testId}?populate=true`);

        setData((prev) => ({
          ...prev,
          data: res.data.questions,
          isLoading: false,
        }));
        dispatch(setQuestions(res?.data?.questions));
        dispatch(setAnswers(res?.data?.questions?.map((q) => q.answer)));
      } catch (error) {
        setData((prev) => ({ ...prev, isError: error, isLoading: false }));
      }
    })();

    return () => {
      setData({ isLoading: false, data: [], isError: null });
      dispatch(setQuestions([]));
      dispatch(setAnswers([]));
    };
  }, [testId]);

  return getData;
};
