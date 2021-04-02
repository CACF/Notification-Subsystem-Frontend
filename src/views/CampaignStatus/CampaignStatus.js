import React, { useState, useEffect } from "react";
import { Col, Row, Table, Card, CardHeader, CardBody } from "reactstrap";
import { getCampaignStatus } from "../../actions/campaignStatusAction";
import TableLoader from "../../components/Loaders/TableLoader";
import { updateTokenHOC } from "../../utilities/helpers";
import { animations } from "react-animation";
import { connect } from "react-redux";
import i18n from "i18next";
const CampaignStatus = (props) => {
  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeQueues, setactiveQueues] = useState({});
  const [activeTasks, setactiveTasks] = useState({});
  const [pendingTasks, setpendingTasks] = useState({});
  const [activeWorkers, setactiveWorkers] = useState([]);

  useEffect(() => {
    updateTokenHOC(props.getCampaignStatus, props.kc);
    setError(props.data.error);
    setLoading(props.data.loading);
    setactiveQueues(props.data.active_queues);
    setactiveTasks(props.data.active_tasks);
    setpendingTasks(props.data.pending_tasks);
    setactiveWorkers(props.data.active_workers);
  }, []);

  const activeTasksLength = (data) => {
    let length = 0;
    Object.keys(data).map((item) =>
      data[item].map((key) => {
        length++;
      })
    );
    return length;
  };

  // const getPendindTable = (data) => {
  //   return (
  //     <>
  //       <Table className="table">
  //         <thead className="thead-light ">
  //           <tr>
  //             <th className=" text-center" style={{ marginLeft: "25px" }}>
  //               {i18n.t("dashboardLabel.worker")}{" "}
  //             </th>
  //             <th className=" text-center">{i18n.t("id")} </th>
  //             <th className=" text-center">{i18n.t("name")}</th>
  //             <th className=" text-center">{i18n.t("dashboardLabel.queue")}</th>
  //           </tr>
  //         </thead>
  //       </Table>
  //       <Table responsive hover striped bordered size="sm">
  //         <thead className="thead-light"></thead>
  //         <tbody>
  //           {Object.keys(data).map((item) => (
  //             <tr keys={item}>
  //               <td className="w-25 ">{item}</td>
  //               {Object.values(data[item]).length > 0 ? (
  //                 Object.values(data[item]).map((value) => (
  //                   <tr key={value.id}>
  //                     <td className="w-25 ">{value.id}</td>
  //                     <td className="w-25">{value.name}</td>
  //                     <td className="w-25">{value.queue}</td>
  //                   </tr>
  //                 ))
  //               ) : (
  //                 <td>{i18n.t("noResultFound")}</td>
  //               )}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </Table>
  //     </>
  //   );
  // };

  return (
    <div
      style={{
        animation: animations.popIn,
      }}
    >
      <Row>
        <Col xs={12} sm={2} md={12} xl={2}>
          <Card className="maincard">
            <CardHeader className="cardheader">
              <b>
                {i18n.t("dashboardLabel.active")}{" "}
                {i18n.t("dashboardLabel.workers")}{" "}
              </b>
            </CardHeader>

            <CardBody className="cardbody">
              {loading && error ? (
                <TableLoader />
              ) : (
                <Table responsive hover bordered size="sm" className="mt-1">
                  <thead className="thead-light">
                    <tr>
                      <th>{i18n.t("dashboardLabel.worker")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeWorkers.length > 0 ? (
                      activeWorkers.map((value) => (
                        <tr key={value}>
                          <td>{value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="">
                        <td className="font-weight-bold text-danger ">
                          {i18n.t("dashboardLabel.noWorkerFound")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} xl={6}>
          <Card className="maincard">
            <CardHeader className="cardheader">
              <b>
                {i18n.t("dashboardLabel.active")}{" "}
                {i18n.t("dashboardLabel.tasks")}
              </b>
            </CardHeader>

            <CardBody className="cardbody">
              {loading && error ? (
                <TableLoader />
              ) : activeTasksLength(activeTasks) === 0 ? (
                <div className="font-weight-bold text-danger p-2 text-center">
                  <b>{i18n.t("dashboard.noactivetaskfound")}</b>
                </div>
              ) : (
                <Table responsive hover bordered size="sm" className="mt-1">
                  <thead className="thead-light">
                    <tr>
                      <th>{i18n.t("dashboardLabel.worker")} </th>
                      <th>{i18n.t("id")} </th>
                      <th>{i18n.t("name")}</th>
                      <th>{i18n.t("dashboardLabel.queue")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(activeTasks).length > 0
                      ? Object.keys(activeTasks).map((items) => (
                          <React.Fragment key={items}>
                            <tr>
                              {Object.keys(activeTasks[items]).length > 0 && (
                                <td
                                  rowSpan={
                                    Object.keys(activeTasks[items]).length === 0
                                      ? Object.keys(activeTasks[items]).length +
                                        1
                                      : Object.keys(activeTasks[items]).length +
                                        1
                                  }
                                >
                                  {items}
                                </td>
                              )}
                            </tr>
                            {Object.keys(activeTasks[items]).map((item) => (
                              <tr key={activeTasks[items][item].id}>
                                <td>
                                  {activeTasks[items][item].id
                                    ? activeTasks[items][item].id
                                    : "no"}
                                </td>
                                <td>{activeTasks[items][item].name}</td>
                                <td>{activeTasks[items][item].queue}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      : ""}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={4} xl={4}>
          <Card className="maincard">
            <CardHeader className="cardheader">
              <b>
                {i18n.t("dashboardLabel.queues")}
              </b>
            </CardHeader>

            <CardBody className="cardbody">
              {loading && error ? (
                <TableLoader />
              ) : (
                <Table responsive hover bordered size="sm " className="mt-1">
                  <thead className="thead-light">
                    <tr>
                      <th>{i18n.t("dashboardLabel.worker")}</th>
                      <th>{i18n.t("dashboardLabel.queue")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(activeQueues).length > 0 ? (
                      Object.keys(activeQueues).map((value) =>
                        activeQueues[value].map((item) => (
                          <tr key={value}>
                            <td>{value}</td>
                            <td>{item}</td>
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td
                          className="font-weight-bold text-danger "
                          colSpan="6"
                        >
                          {i18n.t("dashboardLabel.noactivequeue")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} xl={12}>
          <Card className="maincard">
            <CardHeader className="cardheader">
              <b>
                {i18n.t("dashboardLabel.pending")}{" "}
                {i18n.t("dashboardLabel.tasks")}
              </b>
            </CardHeader>

            <CardBody className="cardbody">
              {loading && error ? (
                <TableLoader />
              ) : activeTasksLength(pendingTasks) === 0 ? (
                <div className="font-weight-bold text-danger p-2 text-center">
                  <b>{i18n.t("dashboardlabel.nopendingtaskfound")}</b>
                </div>
              ) : (
                <Table responsive hover bordered size="sm" className="mt-1">
                  <thead className="thead-light">
                    <tr>
                      <th>{i18n.t("dashboardLabel.worker")} </th>
                      <th>{i18n.t("id")} </th>
                      <th>{i18n.t("name")}</th>
                      <th>{i18n.t("dashboardLabel.queue")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(pendingTasks).length > 0
                      ? Object.keys(pendingTasks).map((items) => (
                          <React.Fragment key={items}>
                            <tr>
                              {Object.keys(pendingTasks[items]).length > 0 && (
                                <td
                                  rowSpan={
                                    Object.keys(pendingTasks[items]).length ===
                                    0
                                      ? Object.keys(pendingTasks[items])
                                          .length + 1
                                      : Object.keys(pendingTasks[items])
                                          .length + 1
                                  }
                                >
                                  {items}
                                </td>
                              )}
                            </tr>

                            {Object.keys(pendingTasks[items]).map((item) => (
                              <tr key={pendingTasks[items][item].id}>
                                <td>{pendingTasks[items][item].id}</td>
                                <td>{pendingTasks[items][item].name}</td>
                                <td>{pendingTasks[items][item].queue}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      : ""}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
const mapPropsToState = (state) => ({
  data: state.campaignStatus,
});
export default connect(mapPropsToState, { getCampaignStatus })(CampaignStatus);
