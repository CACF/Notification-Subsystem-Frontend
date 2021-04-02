import React, { useEffect } from "react";
import { Row, Col, Button, Form, Card, CardHeader, CardBody } from "reactstrap";
import i18n from "i18next";
import { withFormik, Field } from "formik";
import { animations } from "react-animation";
import { connect } from "react-redux";
import {
  updateTokenHOC,
  SweetAlert,
  errors,
  getAuthHeader,
} from "./../../../utilities/helpers";
import { getOperatorsList } from "./../../../actions/operatorsAction";
import { getExtension, getSMSCalcluator } from "./../../../utilities/helpers";
import renderInput from "../../../components/Form/RenderInput";
import RenderSelect from "../../../components/Form/RenderSelect";
import renderTextarea from "../../../components/Form/RenderTextarea";
import {
  postSingleSMS,
  postCampaignSMS,
} from "../../../api/createNotificationService";

const SingleBulkSMSInputForm = (props) => {
  const {
    toggle,
    handleSubmit,
    setFieldValue,
    values,
    errors,
    touched,
    operaters,
    setFieldTouched,
  } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={12} sm={12}>
          <Card className="d-block" outline color="primary">
            <CardHeader>
              <b>
                {" "}
                {toggle ? i18n.t("single") : i18n.t("bulkCampaign")} {i18n.t("sms")}{" "}
              </b>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div
                    style={
                      toggle
                        ? { animation: animations.slideIn }
                        : { animation: animations.fadeInUp }
                    }
                    className="d-block"
                  >
                    <Col>
                      <Row>
                        {toggle && (
                          <Col xs={12} sm={12}>
                            <Field
                              requiredStar
                              name="imei"
                              component={renderInput}
                              type="text"
                              label={i18n.t("imei")}
                              maxLength={16}
                              placeholder={i18n.t("imei")}
                            />
                          </Col>
                        )}
                        {!toggle && (
                          <Col xs={12} sm={12}>
                            <RenderSelect
                              value={values.mode}
                              onChange={setFieldValue}
                              options={[
                                { label: "File", value: "File" },
                                { label: "DB", value: "DB" },
                              ]}
                              onBlur={setFieldTouched}
                              error={errors.mode}
                              touched={touched.mode}
                              fieldName="mode"
                              label={i18n.t("Mode")}
                              placeholder={i18n.t("selectmode")}
                              requiredStar
                              stayOpen={true}
                              multi={false}
                            />
                            <br />
                          </Col>
                        )}
                        {!toggle && (
                          <Col xs={12} sm={12}>
                            <Field
                              requiredStar
                              name="sms_rate"
                              component={renderInput}
                              type="text"
                              label={i18n.t("smsrate")}
                              placeholder={i18n.t("smsrate")}
                            />
                          </Col>
                        )}

                        <Col xs={12} sm={12}>
                          <RenderSelect
                            value={values.operator}
                            onChange={setFieldValue}
                            options={operaters}
                            onBlur={setFieldTouched}
                            error={errors.operator}
                            touched={touched.operator}
                            fieldName="operator"
                            label={i18n.t("operator")}
                            placeholder={i18n.t("selectoperator")}
                            requiredStar
                            stayOpen={true}
                            multi={false}
                          />
                          <br />
                        </Col>

                        <Col xs={12} sm={12}>
                          <Field
                            requiredStar
                            name="sms_from"
                            component={renderInput}
                            type="text"
                            label={i18n.t("smsfrom")}
                            placeholder={i18n.t("smsfrom")}
                          />
                        </Col>
                      </Row>
                    </Col>
                    {toggle && (
                        <Col xs={12} sm={12}>
                          <Field
                            requiredStar
                            name="sms_to"
                            component={renderInput}
                            type="text"
                            label={i18n.t("smsto")}
                            placeholder={i18n.t("smsto")}
                            maxLength={12}
                          />
                        </Col>
                      )}
                      {!toggle && !(values.mode.value === "DB") && values.mode !== "" && (
                        <Col xs={12} sm={12}>
                          <Field
                            requiredStar
                            name="file"
                            component={renderInput}
                            type="text"
                            label={i18n.t("file")}
                            placeholder={i18n.t("file")}
                          />
                        </Col>
                      )}
                  </div>
                </Col>
                <Col>
                  <div
                    style={
                      toggle
                        ? { animation: animations.slideIn }
                        : { animation: animations.fadeInUp }
                    }
                  >
                    <Row>


                      <Col xs={12} sm={12}>
                        <Field
                          requiredStar
                          name="sms_content"
                          component={renderTextarea}
                          type="textarea"
                          label={i18n.t("smscontent")}
                          placeholder={i18n.t("smscontent")}
                          maxLength={1600}
                        />
                        <span className="float-right text-dark mt-0">
                          {" "}
                          {getSMSCalcluator(values.sms_content)}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="text-right mt-1">
                  <Button
                    outline
                    color="primary"
                    className="float-right mr-3"
                    type="submit"
                  >
                    {i18n.t("submit")}
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

const EnhancedSingleBulkForm = withFormik({
  mapPropsToValues: () => ({
    sms_to: "",
    sms_from: "",
    imei: "",
    subsystem: "",
    operator: "",
    sms_rate: "",
    sms_content: "",
    mode: "",
    file: "",
  }),
  /**
   * Formik validations
   * @param values
   */
  validate: (values, props) => {
    //single email validation
    if (props.toggle) {
      let errors = {};
      if (!values.imei) {
        errors.imei = i18n.t("validation.thisFieldIsRequired");
      } else if (!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imei)) {
        errors.imei = i18n.t("validation.imeiMustContain");
        // errors.imei = "validation.imeiMustContain";
      }
      if (!values.sms_from) {
        errors.sms_from = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.sms_to) {
        errors.sms_to = i18n.t("validation.thisFieldIsRequired");
      } else if (
        !/^((\+92)|(92))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(
          values.sms_to
        )
      ) {
        errors.sms_to = i18n.t(
          "validation.invalidFormatValidFormatIs3001234567891"
        );
      }

      if (!values.operator) {
        errors.operator = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.sms_content) {
        errors.sms_content = i18n.t("validation.thisFieldIsRequired");
      }
      return errors;
    }
    //bulk validation
    else {
      let errors = {};
      if (!values.mode) {
        errors.mode = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.sms_from) {
        errors.sms_from = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.operator) {
        errors.operator = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.sms_content) {
        errors.sms_content = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.sms_rate) {
        errors.sms_rate = i18n.t("validation.thisFieldIsRequired");
      } else if (isNaN(values.sms_rate)) {
        errors.sms_rate = i18n.t("Enter Number Value");
      }
      if (values.mode.value === "File") {
        if (!values.file) {
          errors.file = i18n.t("validation.thisFieldIsRequired");
        } else if (
          getExtension(values.file) !== "csv" &&
          getExtension(values.file) !== "txt"
        ) {
          errors.file = i18n.t("validation.invalideFileExtension");
        }
      }
      return errors;
    }
  },
  /**
   * Formik submit function
   * @param values
   * @param bag
   */

  handleSubmit: (values, bag) => {
    if (bag.props.toggle) {
      let response = UpdatedTokenHOC(
        bag.props.postSingleSMS,
        prepareAPIRequest(bag.props.toggle, values),
        bag
      );
      response
        .then((res) => {
          if (res.status === 200) {
            let params = {
              icon: "success",
              title: "Success",
              message: res.data.message,
              type: "Success",
            };
            SweetAlert(params);
            bag.resetForm();
          }
        })
        .catch((err) => errors(this, err));
    } else {
      let response = UpdatedTokenHOC(
        bag.props.postCampaignSMS,
        prepareAPIRequest(bag.props.toggle, values),
        bag
      );
      response
        .then((res) => {
          if (res.status === 200) {
            let params = {
              icon: "success",
              title: "Success",
              message: res.data.message,
              type: "Success",
            };
            SweetAlert(params);
            bag.resetForm();
          }
        })
        .catch((err) => errors(this, err));
    }
  },
  displayName: "SingleBulkSMSInputForm", // helps with React DevTools
})(SingleBulkSMSInputForm);
//prepareAPIRequest set server data

const UpdatedTokenHOC = (callingFunc, request, bag) => {
  let config = null;
  if (bag.props.kc.isTokenExpired(0)) {
    bag.props.kc
      .updateToken(0)
      .success(() => {
        localStorage.setItem("token", bag.props.kc.token);
        config = {
          headers: getAuthHeader(bag.props.kc.token),
        };
        callingFunc(config, request);
      })
      .error(() => bag.props.kc.logout());
  } else {
    config = {
      headers: getAuthHeader(),
    };

    return callingFunc(config, request);
  }
};
const prepareAPIRequest = (toggle, values) => {
  if (toggle) {
    let sendingData = {};
    sendingData.imei = values.imei;
    sendingData.sms_to = values.sms_to;
    sendingData.sms_from = values.sms_from;
    sendingData.subsystem = "Ops-DashBoard";
    sendingData.operator = values.operator.value;
    sendingData.sms_content = values.sms_content;

    return sendingData;
  } else {
    let sendingData = {};
    sendingData.sms_from = values.sms_from;
    sendingData.sms_content = values.sms_content;
    sendingData.operator = values.operator.value;
    sendingData.sms_rate = parseInt(values.sms_rate);
    sendingData.subsystem = "Ops-DashBoard";
    sendingData.mode = values.mode.value;
    if (values.mode.value === "File") {
      sendingData.file = values.file;
    }
    return sendingData;
  }
};

const SMS = (props) => {
  useEffect(() => {
    updateTokenHOC(props.getOperatorsList, props.kc);
  }, []);
  const setOperatorsParams = (data) => {
    if (data.error === false) {
      let operators = [];
      for (const key of Object.values(data.operators.mnos)) {
        operators.push({ value: key, label: key });
      }
      return operators;
    } else {
      return null;
    }
  };

  return (
    <>
      <EnhancedSingleBulkForm
        toggle={props.toggle}
        operaters={setOperatorsParams(props.operators)}
        postSingleSMS={postSingleSMS}
        postCampaignSMS={postCampaignSMS}
        kc={props.kc}
      />
    </>
  );
};
const mapPropsToState = (state) => ({
  operators: state.operators,
});
export default connect(mapPropsToState, {
  postSingleSMS,
  getOperatorsList,
  postCampaignSMS,
})(SMS);
