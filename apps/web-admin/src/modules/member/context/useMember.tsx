import { useContext } from "react";
import { MemberContext } from "./Context";

export const useMember = () => {
  const memberContext = useContext(MemberContext);
  if (!memberContext)
    throw new Error("Member has to be used within <MemberContext>");
  return memberContext;
};
