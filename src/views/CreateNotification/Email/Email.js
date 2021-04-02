import React, { Component } from "react";
import { Row, Col, Button, Form, Card, CardHeader, CardBody } from "reactstrap";
import {
  SweetAlert,
  errors,
  getAuthHeader,
} from "./../../../utilities/helpers";
import { withFormik, Field } from "formik";
import { animations } from "react-animation";
import { connect } from "react-redux";
import i18n from "i18next";
import { getExtension, getSMSCalcluator } from "./../../../utilities/helpers";
import renderInput from "../../../components/Form/RenderInput";
import RenderSelect from "../../../components/Form/RenderSelect";
import renderTextarea from "../../../components/Form/RenderTextarea";
import {
  postSingleEmail,
  postCampaignEmail,
} from "../../../api/createNotificationService";
class SingleBulkSMSInputForm extends Component {
  render() {
    const {
      toggle,
      handleSubmit,
      setFieldValue,
      values,
      errors,
      touched,
      setFieldTouched,
    } = this.props;

    return (
      //Single SMS Form
      <Form onSubmit={handleSubmit}>
        <Card outline color="primary">
          <CardHeader>
            <b>
              {toggle ? i18n.t("single") : i18n.t("bulkCampaign")} {i18n.t("email")}
            </b>
          </CardHeader>
          <CardBody>
            <Row xs="2" className="mt-2">
              <Col>
                <div
                  style={
                    toggle
                      ? { animation: animations.slideIn }
                      : { animation: animations.fadeInUp }
                  }
                >
                  <Col>
                    <Row>
                      {toggle && (
                        <Col xs={12} sm={12}>
                          <Field
                            requiredStar
                            name="imei"
                            maxLength={16}
                            component={renderInput}
                            type="text"
                            label={i18n.t("imei")}
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

                      <Col xs={12} sm={12}>
                        <Field
                          requiredStar
                          name="email_from"
                          component={renderInput}
                          type="text"
                          label={i18n.t("emailfrom")}
                          placeholder={i18n.t("emailfrom")}
                        />
                      </Col>
                      {toggle && (
                        <Col xs={12} sm={12}>
                          <Field
                            requiredStar
                            name="email_to"
                            component={renderInput}
                            type="text"
                            label={i18n.t("emailto")}
                            placeholder={i18n.t("emailto")}
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
                    </Row>
                  </Col>
                  <Col xs={12} sm={12}>
                    <Field
                      requiredStar
                      name="email_subject"
                      component={renderInput}
                      type="text"
                      label={i18n.t("emailsubject")}
                      placeholder={i18n.t("emailsubject")}
                    />
                  </Col>
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
                        name="email_content"
                        component={renderTextarea}
                        type="textarea"
                        label={i18n.t("emailcontent")}
                        placeholder={i18n.t("emailcontent")}
                        maxLength={2000}
                      />
                      <span className="float-right text-dark ">
                        {" "}
                        {2000 - (values.email_content.length) }
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
      </Form>
    );
  }
}

const EnhancedSingleBulkForm = withFormik({
  mapPropsToValues: () => ({
    email_to: "",
    email_from: "",
    imei: "",
    subsystem: "",
    email_subject: "",
    email_content: "",
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
      }
      if (!values.email_from) {
        errors.email_from = i18n.t("validation.thisFieldIsRequired");
      } else if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          values.email_from
        )
      ) {
        errors.email_from = i18n.t("validation.invalidemailadrress");
      }
      if (!values.email_to) {
        errors.email_to = i18n.t("validation.thisFieldIsRequired");
      } else if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          values.email_to
        )
      ) {
        errors.email_to = i18n.t("validation.invalidemailadrress");
      }
      if (!values.email_subject) {
        errors.email_subject = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.email_content) {
        errors.email_content = i18n.t("validation.thisFieldIsRequired");
      }
      return errors;
    }
    //bulk validation
    else {
      let errors = {};
      if (!values.mode) {
        errors.mode = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.email_from) {
        errors.email_from = i18n.t("validation.thisFieldIsRequired");
      } else if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          values.email_from
        )
      ) {
        errors.email_from = i18n.t("validation.invalidemailadrress");
      }

      if (!values.email_subject) {
        errors.email_subject = i18n.t("validation.thisFieldIsRequired");
      }
      if (!values.email_content) {
        errors.email_content = i18n.t("validation.thisFieldIsRequired");
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
        bag.props.postSingleEmail,
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
        bag.props.postCampaignEmail,
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
const prepareAPIRequest = (toggle, values) => {
  let sendingData = {};
  if (toggle) {
    sendingData.imei = values.imei;
    sendingData.email_to = values.email_to;
    sendingData.email_from = values.email_from;
    sendingData.subsystem = "Ops-DashBoard";
    sendingData.email_subject = values.email_subject;
    sendingData.email_content = values.email_content;
  } else {
    sendingData.email_from = values.email_from;
    sendingData.email_content = values.email_content;
    sendingData.email_subject = values.email_subject;
    sendingData.subsystem = "Ops-DashBoard";
    sendingData.mode = values.mode.value;
    if (values.mode.value === "File") {
      sendingData.file = values.file;
    }
  }

  return sendingData;
};
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
const Email = (props) => {
  return (
    <>
      <EnhancedSingleBulkForm
        toggle={props.toggle}
        postCampaignEmail={postCampaignEmail}
        postSingleEmail={postSingleEmail}
        kc={props.kc}
      />
    </>
  );
};

export default connect(null, { postSingleEmail, postCampaignEmail })(Email);
