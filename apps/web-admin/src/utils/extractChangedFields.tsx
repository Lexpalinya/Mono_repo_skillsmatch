import { differenceInYears, isBefore, subYears } from "date-fns";
export const extractChangedFields = <T extends Record<string, any>>(
  oldData: Partial<T>,
  newData: T
): Partial<T> => {
  const changed: Partial<T> = {};

  for (const key in newData) {
    if (newData[key] !== oldData[key]) {
      changed[key] = newData[key];
    }
  }

  return changed;
};

export const calculateAge = (birthDateInput: string | Date): number => {
  const birthDate =
    birthDateInput instanceof Date ? birthDateInput : new Date(birthDateInput);
  const today = new Date();

  let age = differenceInYears(today, birthDate);

  // Check if birthday has occurred yet this year, otherwise subtract 1
  const thisYearBirthday = subYears(today, age);

  if (isBefore(today, thisYearBirthday)) {
    age--;
  }

  return age;
};
