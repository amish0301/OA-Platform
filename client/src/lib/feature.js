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

export const getLast7Days = () => {
  const today = new Date();
  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayname = date.toLocaleDateString("en-us", { weekday: "short" });
    last7Days[6-i] = dayname;
  }

  return last7Days;
};
