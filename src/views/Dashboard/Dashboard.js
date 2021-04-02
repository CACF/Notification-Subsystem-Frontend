import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Label,
  Input,
  Badge,
  ListGroupItem,
  ListGroup,
} from "reactstrap";
import {
  getDashboardCounters,
  getCompletedCampaignsList,
} from "../../actions/dashboardServicesAction";
import { ITEMS_PER_PAGE, PAGE_LIMIT } from "../../utilities/constants";
import { getCampaignStatus } from "../../actions/campaignStatusAction";
import { updateTokenHOC } from "./../../utilities/helpers";
import { animations } from "react-animation";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import i18n from "i18next";
import Pagination from "react-js-pagination";
import moment from "moment";
import StepLoading from "./../../components/Loaders/StepLoading";
import TableLoader from "./../../components/Loaders/TableLoader";
import DataTableInfo from "./../../components/DataTable/DataTableInfo";
import NumberFormat from "react-number-format";
import SwitchToogleButton from "./../../components/Form/SwitchToggleButton";
const Dashboard = (props) => {
  const [start, setStart] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [toggle, settoggle] = useState(true);
  const [bulkEmail, setBulkEmail] = useState([]);
  const [bulkSMS, setBulkSMS] = useState([]);

  useEffect(() => {
    updateTokenHOC(props.getDashboardCounters, props.kc);
    updateTokenHOC(props.getCampaignStatus, props.kc);
    updateTokenHOC(props.getCompletedCampaignsList, props.kc, {
      start: start,
      limit: PAGE_LIMIT,
    });
  }, []);

  useEffect(() => {
    let currentPage = Math.ceil((start + 1) / limit);
    handlePageClick(currentPage, limit);
  }, [limit]);

  React.useLayoutEffect(() => {
    if (props.completedCamaigns.count !== undefined) {
      setTotalCount(props.completedCamaigns.count);
      setLoading(false);
      setError(false);
      const emailArray = [];
      const smsArray = [];
      props.completedCamaigns.campaigns.map((elem, i) => {
        if (elem.campaign_name === "bulk_sms_file") {
          smsArray.push(elem);
        } else if (elem.campaign_name === "bulk_email_file") {
          emailArray.push(elem);
        }
      });
      setBulkSMS(smsArray);
      setBulkEmail(emailArray);
    }
  }, [props.completedCamaigns.count]);

  const handlePageClick = async (page, chlimit) => {
    let a1 = 1;
    let start = a1 + limit * (page - 1) - 1;
    await setStart(start);
    await setActivePage(page);
    updateTokenHOC(
      props.getCompletedCampaignsList,
      props.kc,
      prepareGetBrandsParams(start, limit)
    );
  };
  const toogleBulkChange = (e) => {
    settoggle(!toggle);
  };
  const prepareGetBrandsParams = (start, limit) => {
    let params = {
      start: start,
      limit: limit,
    };
    return params;
  };
  const handleLimitChange = (e) => {
    e.preventDefault();
    let limit = parseInt(e.target.value);
    setLimit(limit);
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
    <div className="animated fadeIn position-relative">
      <Row>
        <Col>
          <ul className="dashbx smsbx">
            <li>
              <div className="iconbx">
                <svg className="icon-registration" fill="#5cb85c">
                  <use xlinkHref="./img/svg-symbol.svg#totalsms"></use>
                </svg>
              </div>
              <h4>
                <span>{i18n.t("dashboardLabel.total")}</span>
                {i18n.t("sms")}
              </h4>
            </li>
            <hr />
            <li>
              <h6>{i18n.t("dashboardLabel.total")}</h6>
              <h3>
                {Object.keys(props.counters).length >= 0 && (
                  <NumberFormat
                    value={props.counters["Total SMS"]}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                )}
              </h3>
            </li>
          </ul>
        </Col>
        <Col>
          <ul className="dashbx emailbx">
            <li>
              <div className="iconbx">
                <svg className="icon-registration" fill="#ffc107">
                  <use xlinkHref="./img/svg-symbol.svg#totalemail"></use>
                </svg>
              </div>
              <h4>
                <span>{i18n.t("dashboardLabel.total")}</span>
                {i18n.t("dashboardLabel.emails")}
              </h4>
            </li>
            <hr />
            <li>
              <h6>{i18n.t("dashboardLabel.total")}</h6>
              <h3>
                {Object.keys(props.counters).length >= 0 && (
                  <NumberFormat
                    value={props.counters["Total Emails"]}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                )}
              </h3>
            </li>
          </ul>
        </Col>
        <Col>
          <ul className="dashbx msisdnbx">
            <li>
              <div className="iconbx">
                <svg className="icon-registration" fill="#d9534f">
                  <use xlinkHref="./img/svg-symbol.svg#activequeue"></use>
                </svg>
              </div>
              <h4>
                <span>{i18n.t("dashboardLabel.unique")}</span>
                {i18n.t("dashboardLabel.msisdns")}
              </h4>
            </li>
            <hr />
            <li>
              <h6>{i18n.t("dashboardLabel.unique")}</h6>
              <h3>
                {Object.keys(props.counters).length >= 0 && (
                  <NumberFormat
                    value={props.counters["Unique MSISDNs"]}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                )}
              </h3>
            </li>
          </ul>
        </Col>
        <Col>
          <ul className="dashbx emailidbx">
            <li>
              <div className="iconbx">
                <svg className="icon-registration" fill="#3f51b5">
                  <use xlinkHref="./img/svg-symbol.svg#emailid"></use>
                </svg>
              </div>
              <h4>
                <span>
                  {i18n.t("")}
                  {i18n.t("dashboardLabel.unique")}{" "}
                </span>
                {i18n.t("")}
                {i18n.t("dashboardLabel.emailids")}
              </h4>
            </li>
            <hr />
            <li>
              <h6>
                {i18n.t("")}
                {i18n.t("dashboardLabel.unique")}
              </h6>
              <h3>
                {Object.keys(props.counters).length >= 0 && (
                  <NumberFormat
                    value={props.counters["Unique Email-IDs"]}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                )}
              </h3>
            </li>
          </ul>
        </Col>
        <Col>
          <ul className="dashbx campaignbx">
            <li>
              <div className="iconbx">
                <svg className="icon-registration" fill="#3f51b5">
                  <use xlinkHref="./img/svg-symbol.svg#campaign"></use>
                </svg>
              </div>
              <h4>
                <span>
                  {i18n.t("")}
                  {i18n.t("dashboardLabel.total")}{" "}
                </span>
                {i18n.t("")}
                {i18n.t("dashboardLabel.campaigns")}
              </h4>
            </li>
            <hr />
            <li>
              <h6>
                {i18n.t("")}
                {i18n.t("dashboardLabel.total")}
              </h6>
              <h3>
                {Object.keys(props.counters).length >= 0 && (
                  <NumberFormat
                    value={props.counters["Total Campaigns"]}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                )}
              </h3>
            </li>
          </ul>
        </Col>
      </Row>

      <Row
        style={{
          animation: animations.slideIn,
        }}
        md={10}
        sm={10}
        xl={10}
      >
        <Col>
          {/* <div className="float-right ">
           <SwitchToogleButton
            offLabel={i18n.t("dashboardLabel.campaignemail")}
            onLabel={i18n.t("dashboardLabel.campaignsms")}
            checked={toggle}
            handleChange={toogleBulkChange}
          />

        </div> */}

          <Col xs={12} sm={12} md={12} xl={12}>
            {loading && error && totalCount > 0 ? (
              <div className="text-center p-5">
                <StepLoading />
              </div>
            ) : totalCount > 0 ? (
              <Table
                responsive
                hover
                bordered
                size="sm mt-1"
                style={{ height: "480px" }}
              >
                <thead className="thead-light">
                  <tr>
                    <th colSpan="6">
                      <b>{i18n.t("dashboardLabel.completedcampaign")} </b>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center align-middle">
                      {i18n.t("dashboardLabel.campaignname")}{" "}
                    </th>
                    <th className="text-center align-middle">
                      {i18n.t("dashboardLabel.campaignid")}
                    </th>
                    <th className="text-center align-middle">
                      {i18n.t("dashboardLabel.campaignresult")}
                    </th>
                    <th className="text-center align-middle">
                      {i18n.t("dashboardLabel.campaignstarted")}
                    </th>
                    <th className="text-center align-middle">
                      {i18n.t("dashboardLabel.campaigncompleted")}
                    </th>
                    <th
                      className="text-center align-middle "
                      style={{ width: 150 }}
                    >
                      {i18n.t("dashboardLabel.campaignstatus")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.completedCamaigns.campaigns.map((value) => (
                    <tr key={value.campaign_id}>
                      <td>{value.campaign_name}</td>
                      <td>{value.campaign_id}</td>
                      <td>{value.campaign_result}</td>
                      <td>
                        {moment(value.campaign_started).format(
                          "HH:mm DD/MM/YYYY"
                        )}
                      </td>
                      <td>
                        {moment(value.campaign_completed).format(
                          "HH:mm DD/MM/YYYY"
                        )}
                      </td>
                      <td style={{ width: "22px" }}>
                        <Badge color="success">{value.campaign_status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Card>
                <CardHeader>
                  {" "}
                  <b>{i18n.t("dashboardLabel.completedcampaign")} </b>
                </CardHeader>
                <p className="text-danger ml-2 mt-2 p-1 text-center font-weight-bold">
                  {" "}
                  {i18n.t("noResultFound")}
                </p>
              </Card>
            )}
          </Col>

          {!error && !loading && totalCount > PAGE_LIMIT && (
            <article className="data-footer-dashboard float-right mr-5">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={limit}
                totalItemsCount={totalCount}
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
                <Label>{i18n.t("requests")}</Label>
              </div>
              <div className="start-toend float-left  mr-3 ">
                <DataTableInfo
                  start={start}
                  limit={limit}
                  total={totalCount}
                  itemType={"requests"}
                />
              </div>
            </article>
          )}
        </Col>

        <Col xs={12} md={12} sm={12} xl={2}>
          <ListGroup className="maincard">
            <ListGroupItem style={{ backgroundColor: "#e9ecef" }}>
              <b className="">{i18n.t("dashboardLabel.workers")}</b>
              <span className="float-right btn-sm btn-primary text-white">
                <Link
                  to="/dashboard/campaign-status"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {i18n.t("dashboardLabel.details")}
                </Link>
              </span>
            </ListGroupItem>

            <div>
              {props.activeWorkers.length > 0 ? (
                props.activeWorkers.map((worker) => (
                  <ListGroupItem key={worker} action>
                    {worker}{" "}
                  </ListGroupItem>
                ))
              ) : (
                <div className="text-center mt-4">
                  <TableLoader />
                </div>
              )}
            </div>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};
const mapPropsToState = (state) => ({
  auth: state.auth,
  counters: state.dashboard.counters,
  completedCamaigns: state.dashboard.completedCamaigns,
  activeWorkers: state.campaignStatus.active_workers,
});
export default connect(mapPropsToState, {
  getDashboardCounters,
  getCompletedCampaignsList,
  getCampaignStatus,
})(Dashboard);
