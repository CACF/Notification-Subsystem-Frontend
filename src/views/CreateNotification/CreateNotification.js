import React, { useState } from "react";
import { Card,  CardHeader } from "reactstrap";
import SwitchToogleButton from "./../../components/Form/SwitchToggleButton";
import SMS from "./SMS/SMS";
import Email from "./Email/Email";
import i18n from 'i18next'
const ChamaignCreator = (props) => {
  const [toggleSMSEmail, setToggleSMSEmail] = useState(true);
  const [toggleSingleBulk, settoggleSingleBulk] = useState(true);
  const toogleSMSEmailChange = (_) => {
    setToggleSMSEmail(!toggleSMSEmail);
  };

  const toogleSingleBulkChange = (_) => {
     settoggleSingleBulk(!toggleSingleBulk);
  };
  return (
    <>
    <Card outline color="primary">
      <CardHeader >

        <div className="float-left mt-2">
          <SwitchToogleButton
            offLabel={i18n.t("email")}
            onLabel={i18n.t("sms")}
            checked={toggleSMSEmail}
            handleChange={toogleSMSEmailChange}
            />

        </div>
        <div className="float-right mt-2">
        <SwitchToogleButton
            offLabel={i18n.t("bulkCampaign")}
            onLabel={i18n.t("single")}
            checked={toggleSingleBulk}
            handleChange={toogleSingleBulkChange}
          />

        </div>
            </CardHeader>
    </Card>
    {toggleSMSEmail ? <SMS toggle={toggleSingleBulk} {...props} /> : <Email toggle={toggleSingleBulk}  {...props}/>}
    </>
  );
};

export default ChamaignCreator;
