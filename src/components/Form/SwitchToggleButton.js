import React, { useState } from "react";
import Switch from "react-switch";
import { Tooltip } from "reactstrap";
import i18n from 'i18next'
const SwitchToogleButton = ({
  onLabel,
  offLabel,
  checked,
  handleChange,
  disable,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <div className="d-flex">
      <div className="p-1">
        <label>
          <b ><span className={!checked ? "btn btn-primary btn-sm font-weight-bold disabled" : ""} style={checked ? {opacity:"0.4"} : {opacity:"1",cursor:"default"}}> {offLabel} </span></b>
        </label>
      </div>
      <div className="p-1">
        <span>
          <span
            style={{ textDecoration: "underline", color: "blue" }}
            href="#"
            id="DisabledAutoHideExample"
          >
          
              <Switch
                checked={checked}
                onChange={handleChange}
                onColor="#0275d8"
                offColor="#0275d8"
                onHandleColor="#FFFFFF"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="2px 1px 2px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="2px 1px 2px rgba(0, 0, 0, 0.6)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
                disabled={disable ? disable : false}
              />
           
          </span>
        </span>
      </div>
      <div className="p-1">
        <label>
          <b><span className={checked ? "btn btn-primary btn-sm font-weight-bold disabled" : ""} style={!checked ? {opacity:"0.4"} : {opacity:"1",cursor:"default"}}> {onLabel} </span></b>
        </label>
      </div>
      <Tooltip
        placement="bottom"
        disabled={disable ? false : true}
        isOpen={tooltipOpen}
        autohide={false}
        target="DisabledAutoHideExample"
        toggle={toggle}
      >
        {i18n.t("clearbelowsearch")} 
      </Tooltip>
    </div>
  );
};

export default SwitchToogleButton;
