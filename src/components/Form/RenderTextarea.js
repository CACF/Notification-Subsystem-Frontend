import React from "react";
import {Input, FormGroup, Label, FormFeedback} from 'reactstrap';
const renderTextarea = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const states = (touched[field.name] && errors[field.name]) ? false : null;
  const maxLength = props.maxLength ? props.maxLength : 1000;
  const groupClass = props.groupClass ? props.groupClass : '';
  return (
    <FormGroup className={groupClass}>
      <Label>{props.label} {props.requiredStar &&<span className="text-danger">*</span>} {props.warningStar && <span className="text-warning">*</span>}</Label>
      {props.prefix && <span>{props.prefix}</span>}
      <Input {...field} type="textarea" placeholder={props.placeholder} valid={states} disabled={props.disable} maxLength={maxLength} style={{resize:"none",minHeight: "250px"}}/>
     
      {touched[field.name] &&
      errors[field.name] && <FormFeedback className="d-block">{errors[field.name]}</FormFeedback>}
    </FormGroup>
  )
};

export default renderTextarea;