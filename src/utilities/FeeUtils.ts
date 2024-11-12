export enum FeeStatus {
    PARTIAL = "Partial Paid",
    FULL = "Fully Paid",
    UNPAID = "Unpaid",
    NA ="NA"
  }
  
  const array1 = [
    {
      name: FeeStatus.UNPAID,
      backgroundColor: "#FFDCDC",
      color: "#D48D8D",
    },
    {
      name: FeeStatus.PARTIAL,
      backgroundColor: "#DDEDFD",
      color: "#3976CA",
    },
    {
      name: FeeStatus.FULL,
      backgroundColor: "#E2F8E8",
      color: "#62A976",
    },
    {
      name: FeeStatus.NA,
      backgroundColor: "#EFEFEF",
      color: "#9F9F9F",
    },
  ];
  
  export function getColor(val: string) {
    const found = array1.find((x) => x.name === val);
    if (found) return found;
    return null;
  }