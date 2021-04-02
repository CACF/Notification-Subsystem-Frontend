/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
import React, { Component } from "react";
import { Col, Table, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { PointSpreadLoading } from "react-loadingg";
class SummaryDataTable extends Component {
  render() {
    const { tableData, title } = this.props;
    return (
      <Col xs={12} xl={6} className="order-xl-1">
        {Array.isArray(tableData) ? (
          tableData == 0 ? (
            <Row className="d-flex justify-content-center">
              <PointSpreadLoading
                color="#0093c9"
                speed={1}
                style={{ width: "0px !important" }}
              />
            </Row>
          ) : (
            <Table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search animated fadeIn position-relative">
              <thead className="thead-light">
                <tr>
                  <th>
                    <b>{title}</b>
                  </th>
                  <th></th>
                  <th>
                    <Link to="/summary/oem-response-details">Details</Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>OEM</b>
                  </td>
                  <td>
                    <b>PENDING IMEIS</b>
                  </td>
                  <td>
                    <b>RESPONDED IMEIS</b>
                  </td>
                </tr>
                {tableData
                  ? tableData.map((item) => (
                      <tr key={item.oem}>
                        <td>{item.oem}</td>
                        <td>{item.pending_imeis}</td>
                        <td>{item.responded_imeis}</td>
                      </tr>
                    ))
                  : "No Data Found"}
              </tbody>
            </Table>
          )
        ) : Object.keys(tableData).length === 0 ? (
          <Row className="d-flex justify-content-center">
            <PointSpreadLoading
              color="#0093c9"
              speed={1}
              style={{ width: "0px !important" }}
            />
          </Row>
        ) : (
          <Table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search animated fadeIn position-relative">
            <thead className="thead-light">
              <tr>
                <th>
                  <b>{title}</b>
                </th>
                <th>
                  {title === "OEM Logins Brands Summary" && ""}
                  {title === "User Response Summary" && (
                    <Link to="/summary/user-response-details">Details</Link>
                  )}
                  {title === "Duplication List Summary" && (
                    <Link to="/summary/duplication-list-details">Details</Link>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData
                ? Object.keys(tableData).map((data) =>
                    Object.keys(tableData[data]).map((item) => (
                      <tr key={item}>
                        <td style={{ fontSize: "14", fontStyle: "normal" }}>
                          {item.toUpperCase()}
                        </td>
                        <td>{tableData[data][item]}</td>
                      </tr>
                    ))
                  )
                : "No Data Found"}
            </tbody>
          </Table>
        )}
      </Col>
    );
  }
}

export default SummaryDataTable;
