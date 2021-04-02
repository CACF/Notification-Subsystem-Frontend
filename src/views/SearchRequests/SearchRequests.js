import React, { useState, useEffect, useRef } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import RenderDateRangePicker from "../../components/Form/RenderDateRangePicker";

import {
  Row,
  Col,
  Button,
  Form,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Input,
  Table,
} from "reactstrap";
import { animations } from "react-animation";
import { withFormik, Field } from "formik";
import renderInput from "../../components/Form/RenderInput";
import RenderSelect from "../../components/Form/RenderSelect";
import { updateTokenHOC, setParamsForAPI } from "../../utilities/helpers";
import { ITEMS_PER_PAGE, PAGE_LIMIT } from "../../utilities/constants";
import { getSMSList, getEmailList } from "../../actions/SearchRequestsAction";
import { getOperatorsList } from "../../actions/operatorsAction";
import StepLoading from "../../components/Loaders/StepLoading";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import DataTableInfo from "../../components/DataTable/DataTableInfo";
import SearchFilters from "./SearchFilters";
import moment from "moment";
import SwitchToogleButton from "../../components/Form/SwitchToggleButton";
import i18n from "i18next";
const SearchForm = (props) => {
  let delivered_at = useRef();
  const handleReset = (e, val) => {
    switch (val) {
      case "allsmsemail":
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "imei":
        props.setFieldValue("imei", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "sms_email_to":
        props.setFieldValue("sms_email_to", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "sms_email_from":
        props.setFieldValue("sms_email_from", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "email_subject":
        props.setFieldValue("email_subject", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "subsystem":
        props.setFieldValue("subsystem", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "delivered_at":
        delivered_at.resetDate();
        props.setFieldValue("delivered_at", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "sms_email_content":
        props.setFieldValue("sms_email_content", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "filename":
        props.setFieldValue("filename", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      case "operator":
        props.setFieldValue("operator", "");
        props.delSearchQuery(props.currSearchQuery, val);
        break;
      default:
        break;
    }
  };
  const handleResetForm = () => {
    delivered_at.resetDate();
    props.resetForm();
    props.delSearchQuery(props.currSearchQuery, "all");
  };
  const {
    values,
    showFilters,
    toggle,

    errors,

    isSubmitting,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    touched,
    operaters,
    dirty,
    currSearchQuery,

    SMSEmailToggle,
  } = props;

  return (
    <Form onSubmit={handleSubmit}>
      {currSearchQuery.length > 0 && (
        <div>
          <div className="selected-filters-header">
            <Button
              color="link"
              onClick={() => {
                handleResetForm();
              }}
            >
              {i18n.t("clearAll")}
            </Button>
          </div>
          <SearchFilters filters={currSearchQuery} handleReset={handleReset} />
          <hr />
        </div>
      )}
      <Card
        body
        outline
        className={errors["oneOfFields"] ? "mb-2 border-danger" : "mb-2"}
      >
        <Row>
          <Col xs={12} sm={6} md={4} xl={3}>
            <Field
              name={"imei"}
              component={renderInput}
              type="text"
              label={i18n.t("imei")}
              placeholder={i18n.t("imei")}
            />
          </Col>
          <Col xs={12} sm={6} md={4} xl={3}>
            <Field
              name={"sms_email_to"}
              component={renderInput}
              type="text"
              label={SMSEmailToggle ? i18n.t("smsto") : i18n.t("emailto")}
              placeholder={SMSEmailToggle ? i18n.t("smsto") : i18n.t("emailto")}
            />
          </Col>
          <Col xs={12} sm={6} md={4} xl={3}>
            <Field
              name={"sms_email_from"}
              component={renderInput}
              type="text"
              label={SMSEmailToggle ? i18n.t("smsfrom") : i18n.t("emailfrom")}
              placeholder={
                SMSEmailToggle ? i18n.t("smsfrom") : i18n.t("emailfrom")
              }
            />
          </Col>
          <Col xs={12} sm={6} md={4} xl={3}>
            <Field
              name="subsystem"
              component={renderInput}
              type="text"
              label={i18n.t("subsystem")}
              placeholder={i18n.t("subsystem")}
            />
          </Col>
        </Row>
        <div>
          <div
            className={toggle ? "collapse show animated fadeIn" : "collapse"}
          >
            <Row>
              {SMSEmailToggle && (
                <Col xs={12} sm={6} md={4} xl={3}>
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
              )}
              <Col xs={12} sm={6} md={4} xl={3}>
                <FormGroup>
                  <Label>{i18n.t("delivered_time")}</Label>
                  <RenderDateRangePicker
                    name="delivered_at"
                    ref={(instance) => {
                      delivered_at = instance;
                    }}
                    value={values.delivered_at}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                  />
                </FormGroup>
              </Col>

              <Col xs={12} sm={6} md={4} xl={3}>
                <Field
                  name="filename"
                  component={renderInput}
                  type="text"
                  label={i18n.t("filename")}
                  placeholder={i18n.t("filename")}
                />
              </Col>
              <Col xs={12} sm={6} md={4} xl={3}>
                <Field
                  name={"sms_email_content"}
                  component={renderInput}
                  type="text"
                  label={
                    SMSEmailToggle
                      ? i18n.t("smscontent")
                      : i18n.t("emailcontent")
                  }
                  placeholder={
                    SMSEmailToggle
                      ? i18n.t("smscontent")
                      : i18n.t("emailcontent")
                  }
                />
              </Col>
              {!SMSEmailToggle && (
                <Col xs={12} sm={6} md={4} xl={3}>
                  <Field
                    name="email_subject"
                    component={renderInput}
                    type="text"
                    label={i18n.t("emailsubject")}
                    placeholder={i18n.t("emailsubject")}
                  />
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Card>
      <Field
        name="oneOfFields"
        component={({
          field, // { name, value, onChange, onBlur }
          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          ...props
        }) => (
          <div>
            {" "}
            {errors["oneOfFields"] && (
              <span className="invalid-feedback" style={{ display: "block" }}>
                * {errors[field.name]}
              </span>
            )}{" "}
          </div>
        )}
      />
      <Row className="justify-content-end">
        <Col xs={12} sm={6} md={4} xl={3}>
          <FormGroup>
            <Button color="default" block onClick={showFilters}>
              {toggle ? `${i18n.t("hidefilters")}` : `${i18n.t("showfilters")}`}
            </Button>
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={4} xl={3}>
          <FormGroup>
            <Button color="primary" type="submit" block>
              {i18n.t("searchFilters")}
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

const MyEnhancedForm = withFormik({
  mapPropsToValues: (props) => ({
    sms_email_to: "",
    sms_email_from: "",
    subsystem: "",
    operator: "",
    filename: "",
    delivered_at: "",
    email_subject: "",
    imei: "",
    sms_email_content: "",
    allsmsemail: "allsmsemail",
  }),
  // Custom sync validation
  validate: (values) => {
    let errors = {};

    // if (
    //   !values.sms_email_to &&
    //   !values.sms_email_from &&
    //   !values.subsystem &&
    //   !values.operator &&
    //   !values.filename &&
    //   !values.email_subject &&
    //   !values.delivered_at &&
    //   !values.operator &&
    //   !values.imei &&
    //   !values.sms_email_content
    // ) {
    //   errors.oneOfFields = i18n.t("validation.oneOfTheAboveFieldsIsRequired");
    // }

    // console.log(errors);
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values, bag.props.SMSEmailToggle));
    bag.props.searchQuery(values);
  },

  displayName: "SearchForm", // helps with React DevTools
})(SearchForm);

const prepareAPIRequest = (value, checked) => {
  const formData = new FormData();
  switch (checked) {
    case false:
      formData.email_from = value.sms_email_from;
      formData.email_to = value.sms_email_to;
      formData.subsystem = value.subsystem;
      formData.operator = value.operator;
      formData.filename = value.filename;
      formData.email_delivered = value.delivered_at;
      formData.email_content = value.sms_email_content;
      formData.email_subject = value.email_subject;
      formData.imei = value.imei;
      formData.allemail = value.allsmsemail;

      break;
    case true:
      formData.allsms = value.allsmsemail;
      formData.sms_from = value.sms_email_from;
      formData.subsystem = value.subsystem;
      formData.sms_to = value.sms_email_to;
      formData.operator = value.operator.value;
      formData.filename = value.filename;
      formData.sms_delivered = value.delivered_at;
      formData.sms_content = value.sms_email_content;
      formData.imei = value.imei;
      break;
    default:
      break;
  }
  return formData;
};

const SearchRequests = (props) => {
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [showSMSEmailFilters, setShowSMSEmailFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState({});
  const [currSearchQuery, setCurrSearchQuery] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [apiFetched, setApiFetched] = useState(false);

  const [limit, setLimit] = useState(PAGE_LIMIT);

  useEffect(() => {
    updateTokenHOC(props.getOperatorsList, props.kc);
    document.addEventListener("scroll", handlePagination);
    return () => {
      document.removeEventListener("scroll", handlePagination);
    };
  }, []);
  useEffect(() => {
    let currentPage = Math.ceil((start + 1) / limit);
    handlePageClick(currentPage, limit);
  }, [limit]);
  React.useLayoutEffect(() => {
    if (!props.data.error && !props.data.loading) {
      setApiFetched(true);
      setData(props.data.data.Result);
      setTotalCases(props.data.count);
      setLoading(props.loading);
    }
  }, [
    props.data.error,
    props.data.loading,
    props.data.data.Result,
    props.data.count,
    props.loading,
  ]);
  const isBottom = (el) => {
    return el.getBoundingClientRect().bottom - 100 <= window.innerHeight;
  };
  const handlePagination = () => {
    const wrappedElement = document.getElementById("root");
    if (isBottom(wrappedElement)) {
      document.body.classList.remove("pagination-fixed");
    } else {
      document.body.classList.add("pagination-fixed");
    }
  };
  const handlePageClick = async (page, limitChange) => {
    let a1 = 1;
    let start = a1 + limit * (page - 1) - 1;
    setLoading(true);
    await setStart(start);
    await setActivePage(page);
    let postSearchData = setParamsForAPI(showSMSEmailFilters, searchQuery);
    if (showSMSEmailFilters === true) {
      updateTokenHOC(
        props.getSMSList,
        props.kc,
        prepareGetBrandsParams(
          start,limit , postSearchData
        )
      );
    } else {
      updateTokenHOC(
        props.getEmailList,
        props.kc,
        prepareGetBrandsParams(
          start,
          limit ,
          postSearchData
        )
      );
    }
  };

  const handleLimitChange = (e) => {
    e.preventDefault();
    let limit = parseInt(e.target.value);
    setLimit(limit);
  };

  const handleShowSMSEmail = () => {
    setShowSMSEmailFilters(!showSMSEmailFilters);
  };
  const handleShowFilters = () => {
    setShowAllFilters(!showAllFilters);
  };
  const saveSearchQuery = (params) => {
    console.log("params", params);
    setSearchQuery(params);
    setStart(0);
    setActivePage(1);
    setApiFetched(false);
    setLoading(true);
    setData(null);
    let postSearchData = setParamsForAPI(showSMSEmailFilters, params);
    if (showSMSEmailFilters === true) {
      updateTokenHOC(
        props.getSMSList,
        props.kc,
        prepareGetBrandsParams(start, limit, postSearchData)
      );
    } else {
      updateTokenHOC(
        props.getEmailList,
        props.kc,
        prepareGetBrandsParams(start, limit, postSearchData)
      );
    }
  };

  const prepareGetBrandsParams = (start, limit, search) => {
    let params = {
      search: search,
      start: start,
      limit: limit,
    };
    return params;
  };

  const setSearchQueryInHeader = (values) => {
    let query = [];
    Object.keys(values).map((key) => {
      switch (key) {
        case "imei":
          if (values[key]) {
            query.push({
              filter: key,
              filterName: i18n.t("imei"),
              value: values[key],
            });
          }
          break;
        case "allsmsemail":
          if (values[key]) {
            let filterName = "";
            showSMSEmailFilters
              ? (filterName += i18n.t("All SMS"))
              : (filterName += i18n.t("All Email"));
            query.push({
              filter: key,
              filterName: filterName,
              value: filterName,
            });
          }
          break;
        case "imei":
          if (values[key]) {
            query.push({
              filter: key,
              filterName: i18n.t("imei"),
              value: values[key],
            });
          }
          break;
        case "sms_email_to":
          if (values[key]) {
            let filterName = "";
            showSMSEmailFilters
              ? (filterName += i18n.t("smsto"))
              : (filterName += i18n.t("emailto"));
            query.push({
              filter: key,
              filterName: filterName,
              value: values[key],
            });
          }
          break;
        case "email_subject":
          if (values[key]) {
            query.push({
              filter: key,
              filterName: i18n.t("emailsubject"),
              value: values[key],
            });
          }
          break;
        case "sms_email_content":
          if (values[key]) {
            let filterName = "";
            showSMSEmailFilters
              ? (filterName += i18n.t("smscontent"))
              : (filterName += i18n.t("emailcontent"));
            query.push({
              filter: key,
              filterName: filterName,
              value: values[key],
            });
          }
          break;
        case "delivered_at":
          if (values[key]) {
            let filterName = "";
            showSMSEmailFilters
              ? (filterName += i18n.t("smsdelivered"))
              : (filterName += i18n.t("emaildelivered"));
            query.push({
              filter: key,
              filterName: filterName,
              value: values[key],
            });
          }
          break;
        case "filename":
          if (values[key]) {
            query.push({
              filter: key,
              filterName: i18n.t("filename"),
              value: values[key],
            });
          }
          break;
        case "operator":
          if (values[key].value) {
            query.push({
              filter: key,
              filterName: i18n.t("operator"),
              value: values[key].value,
            });
          }
          break;
        case "subsystem":
          if (values[key]) {
            query.push({
              filter: key,
              filterName: i18n.t("subsystem"),
              value: values[key],
            });
          }
          break;
        case "sms_email_from":
          if (values[key]) {
            let filterName = "";
            showSMSEmailFilters
              ? (filterName += i18n.t("smsfrom"))
              : (filterName += i18n.t("emailfrom"));
            query.push({
              filter: key,
              filterName: filterName,
              value: values[key],
            });
          }
          break;
        default:
          break;
      }
      return "";
    });
    setCurrSearchQuery(query);
  };
  const delSearchQuery = (filters, filter) => {
    let searchQueryData = searchQuery;
    if (filter === "all") {
      setCurrSearchQuery([]);
      setSearchQuery({});
      setData(null);
    } else {
      let query = filters.filter((el) => {
        return el.filter !== filter;
      });
      delete searchQueryData[filter];
      setSearchQuery(searchQueryData);
      setCurrSearchQuery(query);
    }
    if (currSearchQuery.length <= 0) {
      setData(null);
    }
  };

  const tabeleRowPaginationFunct = () => {
    if (data !== null && data.length > 0 && totalCases > 0) {
      let search = data.map((searched_request) => (
        <tr key={searched_request.pk}>
          <td data-label={"pk"}>{searched_request.pk}</td>
          <td data-label="IMEIs">{searched_request.imei}</td>
          <td data-label="IMEIs">
            {searched_request.filename ? searched_request.filename : "N/A"}
          </td>
          {showSMSEmailFilters && (
            <td data-label={"operator"}>{searched_request.operator}</td>
          )}
          <td data-label={"subsystem"}>{searched_request.subsystem}</td>
          <td data-label={showSMSEmailFilters ? "sms to" : "email to"}>
            {showSMSEmailFilters
              ? searched_request.sms_to
              : searched_request.email_to}
          </td>
          <td data-label={showSMSEmailFilters ? "sms from" : "email from"}>
            {showSMSEmailFilters
              ? searched_request.sms_from
              : searched_request.email_from}
          </td>
          <td
            data-label={
              showSMSEmailFilters ? "sms delivered" : "email delivered"
            }
          >
            {showSMSEmailFilters
              ? moment(searched_request.sms_delivered).format(
                  "HH:mm DD/MM/YYYY"
                )
              : moment(searched_request.email_delivered).format(
                  "HH:mm DD/MM/YYYY"
                )}
          </td>
          {!showSMSEmailFilters && (
            <td data-label={"email subject"}>
              {searched_request.email_subject}
            </td>
          )}
          <td
            data-label={showSMSEmailFilters ? "sms content" : "email content"}
          >
            {showSMSEmailFilters
              ? searched_request.sms_content
              : searched_request.email_content}
          </td>
        </tr>
      ));
      return search;
    }
  };

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

  let options = ITEMS_PER_PAGE;
  const itemOptions = options.map((item) => {
    return (
      <option key={item.value} value={item.value}>
        {item.label}
      </option>
    );
  });

  return (
    <>
      <div className="search-box animated fadeIn">
        <div className="filters">
          <Card outline color="primary">
            <CardHeader>
              <span className="float-left mt-1">
                <b>
                  {showSMSEmailFilters ? i18n.t("sms") : i18n.t("email")}{" "}
                  {i18n.t("searchFilters")}
                </b>
              </span>
              <div className="float-right">
                <SwitchToogleButton
                  checked={showSMSEmailFilters}
                  handleChange={handleShowSMSEmail}
                  onLabel={i18n.t("sms")}
                  offLabel={i18n.t("email")}
                  disable={currSearchQuery.length > 0 ? true : false}
                />
              </div>
            </CardHeader>
            <CardBody
              style={
                showSMSEmailFilters
                  ? { animation: animations.slideIn }
                  : { animation: animations.fadeInUp }
              }
            >
              <MyEnhancedForm
                showFilters={handleShowFilters}
                toggle={showAllFilters}
                SMSEmailToggle={showSMSEmailFilters}
                delSearchQuery={delSearchQuery}
                currSearchQuery={currSearchQuery}
                operaters={setOperatorsParams(props.operators)}
                callServer={saveSearchQuery}
                searchQuery={setSearchQueryInHeader}
              />
            </CardBody>
          </Card>
        </div>
        <ul className="listbox">
          {loading && currSearchQuery.length > 0 ? (
            <div className="text-center mt-2">
              <StepLoading />
            </div>
          ) : data !== null &&
            data.length > 0 &&
            totalCases > 0 &&
            currSearchQuery.length > 0 ? (
            <div>
              <Card className="mb-1" style={{ zIndex: -1 }}>
                <CardHeader className="border-bottom-0">
                  <b className="text-primary">
                    {totalCases > 1
                      ? `${totalCases} ${i18n.t("RequestsFound")}`
                      : `${totalCases} ${i18n.t("RequestFound")}`}
                  </b>
                </CardHeader>
              </Card>
              <Table responsive hover bordered size="sm" className="mt-2">
                <thead className="thead-light">
                  <tr>
                    <th>{i18n.t("id")}</th>
                    <th>{i18n.t("imei")}</th>
                    <th>{i18n.t("Filename")}</th>
                    {showSMSEmailFilters && <th>{i18n.t("operator")}</th>}
                    <th>{i18n.t("subsystem")}</th>
                    <th>
                      {showSMSEmailFilters
                        ? i18n.t("smsto")
                        : i18n.t("emailto")}
                    </th>
                    <th>
                      {showSMSEmailFilters
                        ? i18n.t("smsfrom")
                        : i18n.t("emailfrom")}
                    </th>
                    <th>
                      {showSMSEmailFilters
                        ? i18n.t("smsdelivered")
                        : i18n.t("emaildelivered")}
                    </th>
                    {!showSMSEmailFilters && <th>{i18n.t("emailsubject")}</th>}
                    <th>
                      {showSMSEmailFilters
                        ? i18n.t("smscontent")
                        : i18n.t("emailcontent")}
                    </th>
                  </tr>
                </thead>
                <tbody>{tabeleRowPaginationFunct()}</tbody>
              </Table>
            </div>
          ) : apiFetched && currSearchQuery.length > 0 ? (
            <Card className="mb-1" style={{ zIndex: -1 }}>
              <CardHeader className="border-bottom-0">
                <b className="text-danger">{i18n.t("noRequestFound")}</b>
              </CardHeader>
            </Card>
          ) : null}
        </ul>
        {data !== null &&
          data.length > 0 &&
          totalCases > 0 &&
          totalCases > PAGE_LIMIT &&
          !loading &&
          currSearchQuery.length > 0 && (
            <article className="data-footer">
              <Pagination
                pageRangeDisplayed={
                  window.matchMedia("(max-width: 767px)").matches ? 4 : 10
                }
                activePage={activePage}
                itemsCountPerPage={limit}
                totalItemsCount={totalCases}
                onChange={handlePageClick}
                innerClass="pagination"
              />
              <div className="hand-limit">
                <Label>{i18n.t("show")}</Label>
                <div className="selectbox">
                  <Input
                    value={limit}
                    onChange={(e) => {
                      handleLimitChange(e);
                    }}
                    type="select"
                    name="select"
                  >
                    {itemOptions}
                  </Input>
                </div>
                <Label>{"requests"}</Label>
              </div>
              <div className="start-toend">
                <DataTableInfo
                  start={start}
                  limit={limit}
                  total={totalCases}
                  itemType={"requests"}
                />
              </div>
              <span className="text-primary">{totalCases >= 1000 && i18n.t("recordsmayexceed10k")}</span>
            </article>
          )}
      </div>
    </>
  );
};

const mapPropsToState = (state) => ({
  data: state.data,
  operators: state.operators,
});

export default connect(mapPropsToState, {
  getSMSList,
  getEmailList,
  getOperatorsList,
})(SearchRequests);
