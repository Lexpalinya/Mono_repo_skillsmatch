import type { IReviewAdminDtoType } from "@skillsmatch/dto";

export interface IReviewApplicationProps {
  open: boolean;
}

export interface IReviewApplicationCurrentRowProps
  extends IReviewApplicationProps {
  currentRow: IReviewAdminDtoType;
}
