import {
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


export function MobilePhoneCard(props: {
  phone: string;
  setPhone: (val: string) => void;
}) {

  const [phoneNumber, setPhoneNumber] = useState<string|undefined>(props.phone)

  return (
    <Stack w="100%" spacing={5}>
      <Text fz={18} fw={700}>
        Mobile Number{" "}
        <span
          style={{
            color: "red ",
          }}
        >
          *
        </span>
      </Text>

      <PhoneInput
          country="in"
          placeholder="Enter phone number"
          value={phoneNumber} onChange={
             (value?: string | undefined)=> {
            setPhoneNumber(value);
            if(value){
              var finalPhoneNum =value.toString();
              if(finalPhoneNum[0]=='0')
                {
                 finalPhoneNum =finalPhoneNum.substring(1);
                }
              props.setPhone(`+${finalPhoneNum}`);
            }
          }
          }
          containerStyle={{
            border:"solid 1px #A3A3A3",
            height:"48px"
          }}
          inputStyle={{
            width:"100%",
            height:"100%",
            border:"none"
          }}
        />

    </Stack>
  );
}
