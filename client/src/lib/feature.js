import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../hooks/useAxios";
import { resetResult, setIsLoading } from "../redux/slices/resultSlice";
import { useNavigate } from "react-router-dom";

export const transformImage = (url = "", width = 100) => {
  return url;
};

export const validateInput = (input, questions) => {
  input.trim();

  // Check if input is empty
  if (input === "") {
    return "Input cannot be empty";
  }

  // Check if input is 'all'
  if (input === "all") {
    return null;
  }

  // Check if the input is a valid number or a comma-separated list of numbers
  const nums = input.split(",");
  const invalidNumbers = nums.filter((num) => !/^\d+$/.test(num.trim())); // Check for non-numeric entries

  if (invalidNumbers.length > 0) {
    return `Invalid input: ${invalidNumbers.join(", ")}`;
  }

  // Check if the question numbers exist
  const numArray = nums.map((num) => parseInt(num.trim()));
  const notFoundQuestions = numArray.filter(
    (num) => !questions.some((q) => q.id === num)
  );

  if (notFoundQuestions.length > 0) {
    return `Questions not found: ${notFoundQuestions.join(", ")}`;
  }

  return null;
};

export const handleSubmitTest = async (result, id) => {
  const dispatch = useDispatch();
  const toastId = toast.loading("Submitting test...");
  const navigate = useNavigate();

  dispatch(setIsLoading(true));
  try {
    const { data } = await axiosInstance.post(`/user/submit/${id}`, result);
    console.log('from handleSubmitTest', data);

    if (data.success) {
      toast.update(toastId, {
        render: data.message,
        type: "success",
        isLoading: false,
        autoClose: 1200,
      });
      dispatch(resetResult());
      navigate('/result')
    }
  } catch (error) {
    toast.update(toastId, {
      render: error.response.data.message,
      type: "error",
      isLoading: false,
      autoClose: 1200,
    });
  } finally {
    dispatch(setIsLoading(false));
  }
};
